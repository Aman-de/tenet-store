import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductItem } from "../types";

interface EquationSceneProps {
    top: ProductItem;
    bottom: ProductItem;
    accentColor?: string;
}

export const EquationScene: React.FC<EquationSceneProps> = ({
    top,
    bottom,
    accentColor = "#E0A96D",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 140 },
    });

    // Fast convergence zoom into center
    const zoomProgress = interpolate(frame, [0, 26], [1.0, 1.12], {
        extrapolateRight: "clamp",
    });

    const flashOpacity = interpolate(frame, [18, 22, 26], [0, 0.9, 0], {
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
                overflow: "hidden",
                zIndex: 15,
                backgroundColor: "#0C0A09",
            }}
        >
            {/* Split Screen Image Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 280,
                    width: 780,
                    height: 1040,
                    borderRadius: 32,
                    overflow: "hidden",
                    display: "flex",
                    transform: `scale(${zoomProgress})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                }}
            >
                {/* Left Half: Top */}
                <div
                    style={{
                        flex: 1,
                        height: "100%",
                        overflow: "hidden",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                >
                    <Img
                        src={top.image}
                        style={{
                            width: "200%",
                            height: "100%",
                            objectFit: "cover",
                            transform: "translateX(-25%)",
                        }}
                    />
                </div>

                {/* Right Half: Denim */}
                <div
                    style={{
                        flex: 1,
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    <Img
                        src={bottom.image}
                        style={{
                            width: "200%",
                            height: "100%",
                            objectFit: "cover",
                            transform: "translateX(-25%)",
                        }}
                    />
                </div>

                {/* Clean Subtle Center '+' Marker */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "rgba(12, 10, 9, 0.85)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 32,
                        fontWeight: 800,
                        color: "#FFFFFF",
                    }}
                >
                    +
                </div>
            </div>

            {/* Instagram Safe Header (Y: 200px) */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    left: 80,
                    right: 140,
                    display: "flex",
                    justifyContent: "flex-start",
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
                    TOP + BOTTOM =
                </h1>
            </div>

            {/* Fast Flash Transition to Combo */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#FFFFFF",
                    opacity: flashOpacity,
                    pointerEvents: "none",
                    zIndex: 40,
                }}
            />
        </div>
    );
};
