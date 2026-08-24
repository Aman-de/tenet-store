/**
 * Facebook Page Reels Publishing API (Meta Graph API v19.0)
 * 
 * Official documentation:
 * https://developers.facebook.com/docs/video-api/guides/reels-publishing
 */

export interface FacebookReelOptions {
    videoUrl: string;
    description: string;
    pageId?: string;
}

export class FacebookPublisher {
    private pageAccessToken: string;
    private pageId: string;
    private apiVersion = "v19.0";

    constructor(pageAccessToken?: string, pageId?: string) {
        this.pageAccessToken = pageAccessToken || process.env.FB_PAGE_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "";
        this.pageId = pageId || process.env.FB_PAGE_ID || "";
    }

    /**
     * Step 1: Initialize the Reel upload session
     */
    async initializeReel(description: string): Promise<{ videoId: string; uploadUrl: string }> {
        const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/video_reels`;

        const params = new URLSearchParams({
            upload_phase: "start",
            access_token: this.pageAccessToken,
        });

        const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
        const data = await res.json();

        if (data.error) {
            throw new Error(`[Facebook API Error] ${data.error.message}`);
        }

        console.log(`✅ [Facebook] Initialized Reel Video ID: ${data.video_id}`);
        return { videoId: data.video_id, uploadUrl: data.upload_url };
    }

    /**
     * Step 2: Publish Reel to Facebook Page
     */
    async publishReel(videoId: string, description: string): Promise<string> {
        const url = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/video_reels`;

        const params = new URLSearchParams({
            upload_phase: "finish",
            video_id: videoId,
            video_state: "PUBLISHED",
            description: description,
            access_token: this.pageAccessToken,
        });

        const res = await fetch(`${url}?${params.toString()}`, { method: "POST" });
        const data = await res.json();

        if (data.error) {
            throw new Error(`[Facebook API Error] ${data.error.message}`);
        }

        console.log(`🎉 [Facebook] Reel published successfully!`);
        return data.success ? videoId : "";
    }
}
