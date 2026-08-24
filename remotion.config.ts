import { Config } from "@remotion/cli/config";

// Set the public folder where product images live
Config.setPublicDir("./public");

// Video and rendering settings
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
