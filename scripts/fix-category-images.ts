import fs from 'fs';
import path from 'path';

const logPath = '/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1/.system_generated/tasks/task-5257.log';
const gridPath = '/Users/uditsharma/tenet-store/components/CategoryGrid.tsx';

const logContent = fs.readFileSync(logPath, 'utf-8');
let gridContent = fs.readFileSync(gridPath, 'utf-8');

// Build mapping from old hash to new hash
const mapping: Record<string, string> = {};
const lines = logContent.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Processing asset: image-')) {
        const match = line.match(/image-([a-f0-9]+)-/);
        if (match) {
            const oldHash = match[1];
            // Next line should have the new hash
            const nextLine = lines[i + 1] || '';
            const newMatch = nextLine.match(/Uploaded new WebP asset: image-([a-f0-9]+)-/);
            if (newMatch) {
                mapping[oldHash] = newMatch[1];
            }
        }
    }
}

console.log(`Found ${Object.keys(mapping).length} mappings in log.`);

// Find all old hashes in CategoryGrid
let count = 0;
const hashRegex = /https:\/\/cdn\.sanity\.io\/images\/9zyx0aef\/production\/([a-f0-9]+)_(.*?\.webp)/g;

gridContent = gridContent.replace(hashRegex, (match, oldHash, rest) => {
    if (mapping[oldHash]) {
        count++;
        // The URL was previously: .../oldHash_1024x1024.webp
        // The new URL should be: .../newHash-1024x1024.webp
        // Notice the new URLs have dashes `-` instead of underscores `_` before dimensions!
        const newRest = rest.replace('_', '-'); 
        return `https://cdn.sanity.io/images/9zyx0aef/production/${mapping[oldHash]}-${newRest}`;
    }
    return match;
});

console.log(`Replaced ${count} URLs in CategoryGrid.tsx`);
fs.writeFileSync(gridPath, gridContent);
