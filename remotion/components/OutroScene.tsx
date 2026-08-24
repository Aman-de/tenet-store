import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface OutroSceneProps {
    brandName?: string;
    websiteUrl?: string;
    accentColor?: string;
    ctaText?: string;
    promoCode?: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
    brandName = "TENET",
    websiteUrl = "tenet.store",
    accentColor = "#E0A96D",
    ctaText = "SHOP THE SET",
    promoCode,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoSpring = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const ctaSpring = spring({
        frame: frame - 4,
        fps,
        config: { damping: 12, stiffness: 110 },
    });

    const shineProgress = interpolate(frame, [0, 30], [-150, 250], {
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
                justifyContent: "center",
                zIndex: 20,
                background: "radial-gradient(circle at center, #1B120B 0%, #050608 80%)",
            }}
        >
            {/* Spotlight Glow */}
            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor} 0%, transparent 65%)`,
                    opacity: 0.15,
                    filter: "blur(80px)",
                }}
            />

            {/* Brand Logo */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${logoSpring})`,
                    opacity: logoSpring,
                }}
            >
                <div
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "10px 40px",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: 108,
                            fontWeight: 800,
                            letterSpacing: "0.3em",
                            color: "#FFFFFF",
                            textAlign: "center",
                            textShadow: "0 10px 40px rgba(0,0,0,0.8)",
                        }}
                    >
                        {brandName}
                    </h1>

                    {/* Sweeping Light Reflection */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: 100,
                            background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                            transform: `translateX(${shineProgress}%) skewX(-25deg)`,
                            pointerEvents: "none",
                        }}
                    />
                </div>
            </div>

            {/* Clean Pill CTA Button */}
            <div
                style={{
                    marginTop: 40,
                    transform: `scale(${ctaSpring}) translateY(${(1 - ctaSpring) * 20}px)`,
                    opacity: ctaSpring,
                }}
            >
                <div
                    style={{
                        padding: "20px 50px",
                        borderRadius: 99,
                        background: `linear-gradient(135deg, ${accentColor} 0%, #A0522D 100%)`,
                        boxShadow: `0 12px 35px rgba(224, 169, 109, 0.35)`,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 24,
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            color: "#0F0B08",
                            textTransform: "uppercase",
                        }}
                    >
                        SHOP THE SET
                    </span>
                    <span
                        style={{
                            fontSize: 26,
                            fontWeight: 900,
                            color: "#0F0B08",
                        }}
                    >
                        →
                    </span>
                </div>
            </div>

            {/* Website URL */}
            <div
                style={{
                    marginTop: 28,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#A1A1AA",
                    textTransform: "uppercase",
                }}
            >
                {websiteUrl}
            </div>
        </div>
    );
};
