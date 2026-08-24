import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BrandHeaderProps {
    brandName?: string;
    collectionName?: string;
    accentColor?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
    brandName = "TENET",
    collectionName = "AUTUMN / WINTER 2026",
    accentColor = "#D4AF37",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideDown = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 90 },
    });

    const lineProgress = interpolate(frame, [0, 45], [0, 100], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                top: 70,
                left: 60,
                right: 60,
                display: "flex",
                flexDirection: "column",
                zIndex: 30,
                transform: `translateY(${(1 - slideDown) * -40}px)`,
                opacity: slideDown,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 14,
                }}
            >
                {/* Brand Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: 32,
                            fontWeight: 800,
                            letterSpacing: "0.3em",
                            color: "#FFFFFF",
                        }}
                    >
                        {brandName}
                    </span>
                </div>

                {/* Collection / Season Badge */}
                <div
                    style={{
                        padding: "6px 16px",
                        borderRadius: 99,
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        color: "#E4E4E7",
                        textTransform: "uppercase",
                    }}
                >
                    {collectionName}
                </div>
            </div>

            {/* Subtle Metallic Underline */}
            <div
                style={{
                    width: `${lineProgress}%`,
                    height: 1,
                    background: `linear-gradient(90deg, ${accentColor} 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                }}
            />
        </div>
    );
};
