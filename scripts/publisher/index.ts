/**
 * Tenet Store - Unified Social Media Auto-Publisher CLI
 * 
 * Usage:
 *   npx tsx scripts/publisher/index.ts --file=out/chocolate-denim-outfit.mp4 --platform=youtube --title="Chocolate Kurti Fit"
 *   npx tsx scripts/publisher/index.ts --url=https://your-domain.com/video.mp4 --platform=instagram --caption="Comment 1 or 2 👇 #Tenet"
 */

import * as dotenv from "dotenv";
import path from "path";
import { InstagramPublisher } from "./instagram";
import { YouTubePublisher } from "./youtube";
import { FacebookPublisher } from "./facebook";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

interface CliArgs {
    file?: string;
    url?: string;
    platform: "instagram" | "youtube" | "facebook" | "all";
    title?: string;
    caption?: string;
}

function parseArgs(): CliArgs {
    const args = process.argv.slice(2);
    const parsed: Record<string, string> = {};

    for (const arg of args) {
        if (arg.startsWith("--")) {
            const [key, ...vals] = arg.slice(2).split("=");
            parsed[key] = vals.join("=");
        }
    }

    return {
        file: parsed.file,
        url: parsed.url,
        platform: (parsed.platform as CliArgs["platform"]) || "all",
        title: parsed.title || "Tenet Women's Edit • Styling The Look",
        caption:
            parsed.caption ||
            "Which one are you wearing? Comment 1 or 2 below! 👇✨\n\nShop the look at tenet.store\n\n#Tenet #OutfitOfTheDay #KurtiStyle #DenimFashion #TrendingReels",
    };
}

async function main() {
    const args = parseArgs();
    console.log("==================================================");
    console.log("🌟 TENET AUTO-PUBLISHER ENGINE (REAL API)");
    console.log("==================================================");
    console.log(`Platform : ${args.platform}`);
    console.log(`Title    : ${args.title}`);
    console.log(`File/URL : ${args.file || args.url || "N/A"}`);
    console.log("==================================================");

    // 1. YouTube Shorts Upload
    if (args.platform === "youtube" || args.platform === "all") {
        if (args.file) {
            try {
                const yt = new YouTubePublisher();
                const filePath = path.isAbsolute(args.file)
                    ? args.file
                    : path.join(process.cwd(), args.file);

                await yt.uploadShort({
                    filePath,
                    title: args.title || "Tenet Fashion Edit #Shorts",
                    description: args.caption || "",
                });
            } catch (err: any) {
                console.error(`❌ [YouTube Error] ${err.message}`);
            }
        } else {
            console.log("ℹ️ [YouTube] Skipped (requires local --file argument).");
        }
    }

    // 2. Instagram Reels Publish
    if (args.platform === "instagram" || args.platform === "all") {
        if (args.url) {
            try {
                const ig = new InstagramPublisher();
                await ig.publish({
                    videoUrl: args.url,
                    caption: args.caption || "",
                });
            } catch (err: any) {
                console.error(`❌ [Instagram Error] ${err.message}`);
            }
        } else {
            console.log("ℹ️ [Instagram] Skipped (Instagram API requires a public HTTPS --url for the MP4 video).");
        }
    }

    // 3. Facebook Reels Publish
    if (args.platform === "facebook" || args.platform === "all") {
        if (args.url) {
            try {
                const fb = new FacebookPublisher();
                const session = await fb.initializeReel(args.caption || "");
                await fb.publishReel(session.videoId, args.caption || "");
            } catch (err: any) {
                console.error(`❌ [Facebook Error] ${err.message}`);
            }
        }
    }
}

main().catch(console.error);
