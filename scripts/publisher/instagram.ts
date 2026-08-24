/**
 * Instagram Content Publishing API (Meta Graph API v19.0)
 * 
 * Official documentation:
 * https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing
 */

export interface InstagramPublishOptions {
    videoUrl: string; // Publicly accessible HTTPS URL of the MP4
    caption: string;
    coverUrl?: string;
    shareToFeed?: boolean;
}

export class InstagramPublisher {
    private accessToken: string;
    private igAccountId: string;
    private apiVersion = "v19.0";

    constructor(accessToken?: string, igAccountId?: string) {
        this.accessToken = accessToken || process.env.META_ACCESS_TOKEN || "";
        this.igAccountId = igAccountId || process.env.INSTAGRAM_ACCOUNT_ID || "";

        if (!this.accessToken || !this.igAccountId) {
            console.warn(
                "⚠️ Missing META_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID in environment."
            );
        }
    }

    /**
     * Step 1: Create a media container for the Reel
     */
    async createReelContainer(options: InstagramPublishOptions): Promise<string> {
        const url = `https://graph.facebook.com/${this.apiVersion}/${this.igAccountId}/media`;

        const params = new URLSearchParams({
            media_type: "REELS",
            video_url: options.videoUrl,
            caption: options.caption,
            share_to_feed: options.shareToFeed !== false ? "true" : "false",
            access_token: this.accessToken,
        });

        if (options.coverUrl) {
            params.append("cover_url", options.coverUrl);
        }

        const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
        const data = await res.json();

        if (data.error) {
            throw new Error(`[Instagram API Error] ${data.error.message} (Code: ${data.error.code})`);
        }

        console.log(`✅ [Instagram] Created Reel container ID: ${data.id}`);
        return data.id;
    }

    /**
     * Step 2: Poll container upload status until FINISHED
     */
    async waitForProcessing(creationId: string, maxAttempts = 30): Promise<boolean> {
        const url = `https://graph.facebook.com/${this.apiVersion}/${creationId}?fields=status_code,status&access_token=${this.accessToken}`;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                throw new Error(`[Instagram API Error] ${data.error.message}`);
            }

            const status = data.status_code;
            console.log(`⏳ [Instagram] Container status check (${attempt}/${maxAttempts}): ${status}`);

            if (status === "FINISHED") {
                return true;
            } else if (status === "ERROR") {
                throw new Error(`[Instagram API Error] Media processing failed: ${JSON.stringify(data)}`);
            } else if (status === "EXPIRED") {
                throw new Error("[Instagram API Error] Container expired before publishing.");
            }

            // Wait 5 seconds before next poll
            await new Promise((r) => setTimeout(r, 5000));
        }

        throw new Error("[Instagram API Error] Media processing timed out.");
    }

    /**
     * Step 3: Publish the processed Reel to Instagram feed
     */
    async publishReel(creationId: string): Promise<string> {
        const url = `https://graph.facebook.com/${this.apiVersion}/${this.igAccountId}/media_publish`;

        const params = new URLSearchParams({
            creation_id: creationId,
            access_token: this.accessToken,
        });

        const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
        const data = await res.json();

        if (data.error) {
            throw new Error(`[Instagram API Error] ${data.error.message}`);
        }

        console.log(`🎉 [Instagram] Reel successfully published! Post ID: ${data.id}`);
        return data.id;
    }

    /**
     * Full Automated End-to-End Publish Flow
     */
    async publish(options: InstagramPublishOptions): Promise<string> {
        console.log("🚀 Starting Instagram Reel publication...");
        const containerId = await this.createReelContainer(options);
        await this.waitForProcessing(containerId);
        const postId = await this.publishReel(containerId);
        return postId;
    }
}
