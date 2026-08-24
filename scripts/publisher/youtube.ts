/**
 * YouTube Shorts Direct Uploader (Google YouTube Data API v3)
 * 
 * Official documentation:
 * https://developers.google.com/youtube/v3/docs/videos/insert
 */

import { google } from "googleapis";
import fs from "fs";

export interface YouTubePublishOptions {
    filePath: string; // Absolute path to MP4 file
    title: string;
    description: string;
    tags?: string[];
    privacyStatus?: "public" | "private" | "unlisted";
}

export class YouTubePublisher {
    private youtube;

    constructor() {
        const clientId = process.env.YOUTUBE_CLIENT_ID;
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
        const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            console.warn(
                "⚠️ Missing YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, or YOUTUBE_REFRESH_TOKEN."
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        this.youtube = google.youtube({
            version: "v3",
            auth: oauth2Client,
        });
    }

    /**
     * Upload MP4 video directly as a YouTube Short
     */
    async uploadShort(options: YouTubePublishOptions): Promise<string> {
        if (!fs.existsSync(options.filePath)) {
            throw new Error(`File not found at path: ${options.filePath}`);
        }

        console.log(`🚀 [YouTube] Uploading Short: ${options.filePath}...`);

        // Ensure title/description contains #Shorts for automatic Shorts shelf indexing
        let description = options.description;
        if (!description.includes("#Shorts") && !description.includes("#shorts")) {
            description += "\n\n#Shorts #Fashion #Tenet";
        }

        const res = await this.youtube.videos.insert({
            part: ["snippet", "status"],
            requestBody: {
                snippet: {
                    title: options.title,
                    description: description,
                    tags: options.tags || ["Shorts", "Fashion", "Outfit", "Kurti", "Denim", "Tenet"],
                    categoryId: "26", // Howto & Style
                },
                status: {
                    privacyStatus: options.privacyStatus || "public",
                    selfDeclaredMadeForKids: false,
                },
            },
            media: {
                body: fs.createReadStream(options.filePath),
            },
        });

        const videoId = res.data.id;
        console.log(`🎉 [YouTube] Short uploaded successfully! Video URL: https://youtube.com/shorts/${videoId}`);
        return videoId || "";
    }
}
