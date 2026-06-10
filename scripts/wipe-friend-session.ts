import fs from 'fs';
import path from 'path';

const SESSIONS_DIR = '/Users/uditsharma/.openclaw/agents/main/sessions';
const SESSION_ID = '2288fa79-751b-46f0-9e87-8c99621d73ea';
const SESSIONS_JSON_PATH = path.join(SESSIONS_DIR, 'sessions.json');

async function main() {
    try {
        console.log(`Stopping session: ${SESSION_ID}`);

        // 1. Delete session files if they exist
        const filesToDelete = [
            path.join(SESSIONS_DIR, `${SESSION_ID}.jsonl`),
            path.join(SESSIONS_DIR, `${SESSION_ID}.trajectory-path.json`),
            path.join(SESSIONS_DIR, `${SESSION_ID}.trajectory.jsonl`)
        ];

        for (const file of filesToDelete) {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log(`Deleted session file: ${path.basename(file)}`);
            }
        }

        // 2. Remove reference from sessions.json
        if (fs.existsSync(SESSIONS_JSON_PATH)) {
            const rawContent = fs.readFileSync(SESSIONS_JSON_PATH, 'utf-8');
            let data = JSON.parse(rawContent);

            if (Array.isArray(data)) {
                const initialLength = data.length;
                data = data.filter((item: any) => item.sessionId !== SESSION_ID);
                console.log(`Filtered sessions.json: removed ${initialLength - data.length} reference(s).`);
                fs.writeFileSync(SESSIONS_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
            } else if (typeof data === 'object' && data !== null) {
                // If it's a map or nested structure
                let changed = false;
                if (data.sessions && Array.isArray(data.sessions)) {
                    const initialLength = data.sessions.length;
                    data.sessions = data.sessions.filter((item: any) => item.sessionId !== SESSION_ID);
                    console.log(`Filtered sessions.json (nested sessions): removed ${initialLength - data.sessions.length} reference(s).`);
                    changed = true;
                }
                if (data.activeSessions && typeof data.activeSessions === 'object') {
                    for (const [key, val] of Object.entries(data.activeSessions)) {
                        if (val === SESSION_ID || (typeof val === 'object' && val !== null && (val as any).sessionId === SESSION_ID)) {
                            delete data.activeSessions[key];
                            console.log(`Deleted activeSessions key: ${key}`);
                            changed = true;
                        }
                    }
                }
                if (changed) {
                    fs.writeFileSync(SESSIONS_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
                }
            }
        }

        console.log('Session successfully wiped!');
    } catch (err) {
        console.error('Error wiping session:', err);
    }
}

main();
