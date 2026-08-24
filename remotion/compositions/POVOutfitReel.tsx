import React from "react";
import {
    AbsoluteFill,
    Img,
    interpolate,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import "../styles/remotion.css";

// Hook Scene (0 - 32 frames)
const POVHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const scale = interpolate(frame, [0, 32], [1.08, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/model_front.png")}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(10, 8, 6, 0.75) 0%, transparent 30%, transparent 65%, rgba(10, 8, 6, 0.85) 100%)",
                }}
            />

            {/* Instagram Safe Zone Big Viral Hook (Y: 200px) */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    left: 70,
                    right: 140,
                    transform: `translateY(${(1 - textEntrance) * -20}px)`,
                    opacity: textEntrance,
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        padding: "8px 20px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.9)",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        marginBottom: 12,
                        textTransform: "uppercase",
                    }}
                >
                    SUMMER EDIT
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 58,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    POV: You found the fit
                </h1>
            </div>
        </AbsoluteFill>
    );
};

// Item Reveal Scene
const ItemScene: React.FC<{
    image: string;
    title: string;
}> = ({ image, title }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const scale = interpolate(frame, [0, 36], [1.06, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 50% 45%, #1C1510 0%, #080706 80%)",
                }}
            />

            {/* Clean Centered Image */}
            <div
                style={{
                    position: "absolute",
                    top: 270,
                    width: 780,
                    height: 1040,
                    borderRadius: 32,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: 190,
                    left: 80,
                    right: 140,
                    transform: `translateY(${(1 - textEntrance) * -20}px)`,
                    opacity: textEntrance,
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 60,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                    }}
                >
                    {title}
                </h2>
            </div>
        </AbsoluteFill>
    );
};

// Result Scene with Rate 1-10 Comment Bait
const ResultScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const isBack = frame >= 24 && frame < 48;
    const isSide = frame >= 48;

    const currentImage = isSide
        ? staticFile("/images/products/chocolate-set/model_side.png")
        : isBack
        ? staticFile("/images/products/chocolate-set/model_back.png")
        : staticFile("/images/products/chocolate-set/model_front.png");

    const cutFrame = isSide ? frame - 48 : isBack ? frame - 24 : frame;
    const scale = interpolate(cutFrame, [0, 24], [1.05, 1.0], {
        extrapolateRight: "clamp",
    });

    const entrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const pulse = 1 + Math.sin(frame * 0.25) * 0.03;

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${scale})`,
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

            {/* Gradient Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(10, 8, 6, 0.7) 0%, transparent 22%, transparent 70%, rgba(10, 8, 6, 0.85) 100%)",
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: 190,
                    left: 80,
                    right: 140,
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 64,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    THE RESULT ✨
                </h1>
            </div>

            {/* Comment Prompt Safe Inset */}
            <div
                style={{
                    position: "absolute",
                    bottom: 270,
                    left: 70,
                    right: 140,
                    display: "flex",
                    justifyContent: "center",
                    transform: `scale(${pulse})`,
                }}
            >
                <div
                    style={{
                        padding: "16px 36px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.95)",
                        boxShadow: "0 12px 35px rgba(224, 169, 109, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            color: "#0A0908",
                            textTransform: "uppercase",
                        }}
                    >
                        RATE THIS FIT 1-10 👇
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const POVOutfitReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908" }}>
            {/* Scene 1: POV Hook (0 - 30 frames / 1.0s) */}
            <Sequence from={0} durationInFrames={30}>
                <POVHookScene />
            </Sequence>

            {/* Scene 2: The Top (30 - 64 frames / 1.13s) */}
            <Sequence from={30} durationInFrames={34}>
                <ItemScene
                    image={staticFile("/images/products/chocolate-set/top_flat.png")}
                    title="THE TOP"
                />
            </Sequence>

            {/* Scene 3: The Denim (64 - 98 frames / 1.13s) */}
            <Sequence from={64} durationInFrames={34}>
                <ItemScene
                    image={staticFile("/images/products/chocolate-set/bottom_flat.jpg")}
                    title="+ THE DENIM"
                />
            </Sequence>

            {/* Scene 4: The Result Multi-Angle (98 - 165 frames / 2.23s) */}
            <Sequence from={98} durationInFrames={67}>
                <ResultScene />
            </Sequence>
        </AbsoluteFill>
    );
};
