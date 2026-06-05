const fs = require('fs');
const path = require('path');

function normalizeName(filename) {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    let normalizedBase = basename.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    return normalizedBase + '.webp';
}

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Match /images/up_to.webp, .jpg, .jpeg
    const regex = /\/images\/[a-zA-Z0-9_\-\/\s\.\(\)]+\.(png|jpg|jpeg)/g;
    content = content.replace(regex, (match) => {
        const parts = match.split('/');
        const filename = parts.pop();
        const newFilename = normalizeName(filename);
        changed = true;
        return [...parts, newFilename].join('/');
    });

    if (content.includes('logo.webp')) {
        content = content.replace(/logo\.png/g, 'logo.webp');
        changed = true;
    }
    if (content.includes('editorial_campaign.webp')) {
        content = content.replace(/editorial_campaign\.png/g, 'editorial_campaign.webp');
        changed = true;
    }
    if (content.includes('editorial_campaign_women.webp')) {
        content = content.replace(/editorial_campaign_women\.png/g, 'editorial_campaign_women.webp');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === 'public' || file.startsWith('.')) continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(file))) {
            replaceInFile(fullPath);
        }
    }
}

processDir(__dirname + '/../');
console.log('Done.');
