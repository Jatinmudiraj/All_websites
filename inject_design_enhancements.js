const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file === 'index.html' || file === 'code.html') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const htmlFiles = getAllFiles(rootDir);
let modifiedCount = 0;

console.log(`Found ${htmlFiles.length} HTML files to enhance...`);

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Skip if already has design-enhancements.css
    if (content.includes('design-enhancements.css')) {
        return;
    }

    // Calculate relative path to assets
    const relPath = path.relative(path.dirname(filePath), rootDir);
    const assetsPath = path.join(relPath, 'assets', 'css', 'design-enhancements.css').replace(/\\/g, '/');

    // Inject design-enhancements.css before </head>
    if (content.includes('</head>')) {
        content = content.replace('</head>', `  <link rel="stylesheet" href="${assetsPath}">\n</head>`);
        modified = true;
    }

    // Add meta tags if missing
    if (!content.includes('theme-color')) {
        const metaTag = '  <meta name="theme-color" content="#3b82f6">\n';
        content = content.replace('</head>', metaTag + '</head>');
        modified = true;
    }

    // Add Open Graph tags for better sharing
    if (!content.includes('og:title')) {
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'Premium Website Theme';

        const ogTags = `  <meta property="og:title" content="${title}">\n  <meta property="og:type" content="website">\n  <meta property="og:description" content="Premium website theme with modern design">\n`;
        content = content.replace('</head>', ogTags + '</head>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ Enhanced: ${path.relative(rootDir, filePath)}`);
        modifiedCount++;
    }
});

console.log(`\n✅ Successfully enhanced ${modifiedCount} files!`);
console.log(`📊 Total files processed: ${htmlFiles.length}`);
