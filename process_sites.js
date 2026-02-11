
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const assetsDir = path.join(rootDir, 'assets');
const sitesList = [];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// Helper to get relative path from file to root (for assets)
function getRelativePath(fromPath, toPath) {
    let rel = path.relative(path.dirname(fromPath), toPath).replace(/\\/g, '/');
    return rel;
}

const allFiles = getAllFiles(rootDir);
const htmlFiles = allFiles.filter(file => file.endsWith('code.html'));

console.log(`Found ${htmlFiles.length} code.html files.`);

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const dir = path.dirname(filePath);
    const parentDir = path.basename(path.dirname(dir)); // Niche (e.g. gym_website)
    const siteName = path.basename(dir); // Site Name (e.g. Flow_house)
    
    // Determine Niche more accurately
    // structure is usually root/Niche/SiteName/code.html
    // So relative from root: Niche/SiteName/code.html
    const relPath = path.relative(rootDir, filePath);
    const parts = relPath.split(path.sep);
    
    let niche = "Uncategorized";
    if (parts.length >= 3) {
        niche = parts[0];
    } else if (parts.length === 2) {
        // e.g. root/SiteName/code.html? Unlikely based on structure
        niche = "Misc";
    }

    // Prepare injection paths
    const assetsCssPath = path.join(assetsDir, 'css', 'global-styles.css');
    const assetsJsPath = path.join(assetsDir, 'js', 'global-enhancement.js');
    
    const relCss = getRelativePath(filePath, assetsCssPath);
    const relJs = getRelativePath(filePath, assetsJsPath);

    // Improvements
    // 1. Viewport
    if (!content.includes('<meta name="viewport"')) {
        content = content.replace('<head>', '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
    
    // 2. Inject CSS/JS
    // Inject before </head> for CSS, before </body> for JS
    if (!content.includes('global-styles.css')) {
        content = content.replace('</head>', `<link rel="stylesheet" href="${relCss}">\n</head>`);
    }
    if (!content.includes('global-enhancement.js')) {
        content = content.replace('</body>', `<script src="${relJs}" defer></script>\n</body>`);
    }

    // 3. Fix Title if empty or default
    // Extract existing title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    let title = siteName.replace(/_/g, ' ');
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
    }

    // Save as index.html
    const newPath = path.join(dir, 'index.html');
    fs.writeFileSync(newPath, content);
    console.log(`Processed: ${niche} / ${siteName} -> index.html`);

    // Add to list
    // Check for screen.png
    let imagePath = 'assets/img/placeholder.png'; // Default
    if (fs.existsSync(path.join(dir, 'screen.png'))) {
        // We need relative path from ROOT for the master index
        imagePath = path.relative(rootDir, path.join(dir, 'screen.png')).replace(/\\/g, '/');
    } else if (fs.existsSync(path.join(dir, 'screenshot.png'))) {
         imagePath = path.relative(rootDir, path.join(dir, 'screenshot.png')).replace(/\\/g, '/');
    }

    sitesList.push({
        niche: niche,
        name: siteName.replace(/_/g, ' '),
        url: path.relative(rootDir, newPath).replace(/\\/g, '/'),
        image: imagePath,
        originalTitle: title
    });
});

// Generate Master Index HTML
const niches = {};
sitesList.forEach(site => {
    if (!niches[site.niche]) {
        niches[site.niche] = [];
    }
    niches[site.niche].push(site);
});

let indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Themes Collection</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
        .card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
    </style>
</head>
<body class="p-8">
    <header class="mb-12 text-center">
        <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Premium Website Themes
        </h1>
        <p class="text-slate-400 text-lg">Curated collection of high-quality designs for every niche.</p>
    </header>

    <main class="max-w-7xl mx-auto space-y-16">
`;

// Sort niches alphabetically
const sortedNiches = Object.keys(niches).sort();

sortedNiches.forEach(niche => {
    const niceNicheName = niche.replace(/_/g, ' ').replace(/-/g, ' ');
    indexContent += `
        <section>
            <div class="flex items-center gap-4 mb-8">
                <h2 class="text-3xl font-bold capitalize text-white">${niceNicheName}</h2>
                <div class="h-px bg-slate-700 flex-grow"></div>
                <span class="text-sm font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full">${niches[niche].length} Themes</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    `;

    niches[niche].forEach(site => {
        indexContent += `
                <a href="${site.url}" target="_blank" class="card bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col group">
                    <div class="relative aspect-video overflow-hidden bg-slate-900">
                        <img src="${site.image}" alt="${site.name}" class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-1 truncate">${site.name}</h3>
                            <p class="text-xs text-slate-400 truncate">${site.originalTitle}</p>
                        </div>
                        <div class="mt-4 flex items-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                            Explore <span class="ml-1 transition-transform group-hover:translate-x-1">→</span>
                        </div>
                    </div>
                </a>
        `;
    });

    indexContent += `
            </div>
        </section>
    `;
});

indexContent += `
    </main>

    <footer class="mt-20 py-8 text-center text-slate-500 border-t border-slate-800">
        <p>&copy; 2024 Theme Collection. All rights reserved.</p>
    </footer>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), indexContent);
console.log('Master index.html generated successfully.');
