import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductItem } from "../types";

interface TopSceneProps {
    top: ProductItem;
    accentColor?: string;
}

export const TopScene: React.FC<TopSceneProps> = ({
    top,
    accentColor = "#E0A96D",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const imageScale = interpolate(frame, [0, 42], [1.06, 1.0], {
        extrapolateRight: "clamp",
    });

    // Quick smooth exit
    const exitOpacity = interpolate(frame, [36, 42], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: exitOpacity,
                overflow: "hidden",
                zIndex: 10,
                backgroundColor: "#0C0A09",
            }}
        >
            {/* Minimal Ambient Glow */}
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
                    top: 280,
                    width: 780,
                    height: 1040,
                    borderRadius: 32,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                    transform: `scale(${imageScale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={top.image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Instagram Safe Clean Header (Y: 200px) */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    left: 80,
                    right: 140,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    transform: `translateY(${(1 - textEntrance) * -20}px)`,
                    opacity: textEntrance,
                    zIndex: 20,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 64,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                    }}
                >
                    THIS TOP
                </h1>
            </div>
        </div>
    );
};
