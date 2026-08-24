import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FullSetLook } from "../types";

interface FullLookSceneProps {
    fullSet: FullSetLook;
    brandName?: string;
    websiteUrl?: string;
    accentColor?: string;
}

export const FullLookScene: React.FC<FullLookSceneProps> = ({
    fullSet,
    brandName = "TENET",
    websiteUrl = "tenet.store",
    accentColor = "#E0A96D",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Multi-Angle Cuts:
    // Frames 0 - 32: Front Angle
    // Frames 32 - 64: Back Detail Angle
    // Frames 64 - 96: Side Profile Angle
    const isFront = frame < 32 || !fullSet.backImage;
    const isBack = frame >= 32 && frame < 64 && Boolean(fullSet.backImage);
    const isSide = frame >= 64 && Boolean(fullSet.sideImage);

    const currentImage = isSide
        ? fullSet.sideImage!
        : isBack
        ? fullSet.backImage!
        : fullSet.frontImage;

    // Smooth subtle camera drift
    const cutFrame = isSide ? frame - 64 : isBack ? frame - 32 : frame;
    const zoomProgress = interpolate(cutFrame, [0, 32], [1.05, 1.0], {
        extrapolateRight: "clamp",
    });

    // Subtle flash on cut
    const cutFlash =
        interpolate(frame, [30, 32, 35], [0, 0.6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }) +
        interpolate(frame, [62, 64, 67], [0, 0.6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

    const headerEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    // Minimal non-distracting Brand Pill entrance (fades in at frame 40 directly on the combo)
    const brandPillEntrance = spring({
        frame: frame - 40,
        fps,
        config: { damping: 14, stiffness: 100 },
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 10,
                backgroundColor: "#0C0A09",
            }}
        >
            {/* Full-Bleed On-Model Product Photo */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${zoomProgress})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={currentImage}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Subtle Gradient Vignette */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                        linear-gradient(to bottom, rgba(10, 8, 6, 0.75) 0%, transparent 22%, transparent 70%, rgba(10, 8, 6, 0.8) 100%)
                    `,
                }}
            />

            {/* Instagram Safe Header (Y: 200px) */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    left: 80,
                    right: 140,
                    display: "flex",
                    justifyContent: "flex-start",
                    transform: `translateY(${(1 - headerEntrance) * -20}px)`,
                    opacity: headerEntrance,
                    zIndex: 20,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 68,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    THE COMBO
                </h1>
            </div>

            {/* Minimal In-Video Luxury Brand Pill (Appears directly over the combo in safe zone) */}
            <div
                style={{
                    position: "absolute",
                    bottom: 300,
                    left: 80,
                    right: 140,
                    display: "flex",
                    justifyContent: "center",
                    transform: `scale(${brandPillEntrance}) translateY(${(1 - brandPillEntrance) * 20}px)`,
                    opacity: brandPillEntrance,
                    zIndex: 25,
                }}
            >
                <div
                    style={{
                        padding: "16px 36px",
                        borderRadius: 99,
                        background: "rgba(18, 14, 11, 0.82)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: 24,
                            fontWeight: 800,
                            letterSpacing: "0.25em",
                            color: "#FFFFFF",
                        }}
                    >
                        {brandName}
                    </span>
                    <span
                        style={{
                            color: accentColor,
                            fontSize: 18,
                            fontWeight: 300,
                        }}
                    >
                        •
                    </span>
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: accentColor,
                            textTransform: "uppercase",
                        }}
                    >
                        SHOP THE SET →
                    </span>
                </div>
            </div>

            {/* Angle Cut Flash */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#FFFFFF",
                    opacity: cutFlash,
                    pointerEvents: "none",
                    zIndex: 40,
                }}
            />
        </div>
    );
};
