# Image Generation Loop Guidelines
When the cron task wakes you up with the prompt "Continue processing the image generation queue", proceed with the following workflow:

1. Run `npx tsx scratch/get-next-generation.ts`.
2. Check the output:
   - If it prints `QUEUE_EMPTY`, terminate the scheduled cron task using the `manage_task` tool with `Action: "kill"`.
   - If it prints a ready product variant:
     - Read the parameters from `scratch/next-generation.json`.
     - Invoke the `generate_image` tool using the prompt from that file.
     - Call `npx tsx scratch/complete-generation.ts <path_to_generated_image>` to upload it to Sanity.
3. Once a variant has been processed, stop calling tools. Let the cron trigger wake you up again for the next variant, preventing timeouts or rate limits.
