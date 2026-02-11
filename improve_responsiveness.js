
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
            if (file.endsWith('.html')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const htmlFiles = getAllFiles(rootDir);
let modifiedCount = 0;

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originallen = content.length;

    // 1. Fix single column grids to be responsive (1 -> 2 -> 3)
    // Only if they don't already have responsive modifiers
    content = content.replace(/class="([^"]*?)grid-cols-1([^"]*?)"/g, (match, p1, p2) => {
        if (match.includes('md:') || match.includes('lg:')) return match;
        // Check context: is it a tiny grid? If specific width is set, maybe don't touch.
        // But generally, full width grid-cols-1 is mobile pattern.
        return `class="${p1}grid-cols-1 md:grid-cols-2 lg:grid-cols-3${p2}"`;
    });

    // 2. Fix two column grids to be responsive (2 -> 3 -> 4)
    content = content.replace(/class="([^"]*?)grid-cols-2([^"]*?)"/g, (match, p1, p2) => {
        if (match.includes('md:') || match.includes('lg:')) return match;
        return `class="${p1}grid-cols-2 md:grid-cols-4${p2}"`;
    });

    // 3. Fix main container width for some known mobile-only patterns
    // Identify tags with "px-4" (mobile padding) but no max-width constraints
    // This is a rough heuristic.
    // content = content.replace(/<main class="([^"]*?)(px-4|p-4)([^"]*?)"/g, (match, p1, p2, p3) => {
    //    if (match.includes('max-w-')) return match;
    //    return `<main class="${p1}${p2}${p3} max-w-7xl mx-auto"`;
    // });

    if (content.length !== originallen) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated grids in: ${path.relative(rootDir, filePath)}`);
        modifiedCount++;
    }
});

console.log(`Start improvement process... Modified ${modifiedCount} files.`);
