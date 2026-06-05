const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../public/images');

// Function to normalize file names
function normalizeName(filename) {
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    
    // Check if it already looks like a dress/product format (has underscores, lowercase)
    // If not, clean it up: lowercase, replace spaces and special chars with underscores
    let normalizedBase = basename.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
        
    return normalizedBase + '.webp';
}

function convertDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            convertDir(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const newName = normalizeName(file);
                const newPath = path.join(dir, newName);

                console.log(`Converting ${file} -> ${newName}...`);
                try {
                    // -lossless for no compression, -metadata none to strip metadata
                    execSync(`cwebp -lossless -metadata none "${fullPath}" -o "${newPath}"`, { stdio: 'ignore' });
                    // Delete old file
                    if (fullPath !== newPath) {
                        fs.unlinkSync(fullPath);
                    }
                } catch (err) {
                    console.error(`Failed to convert ${file}:`, err.message);
                }
            }
        }
    }
}

console.log('Starting conversion...');
convertDir(targetDir);
console.log('Done.');
