import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FloatingPillProps {
    label: string;
    icon?: React.ReactNode;
    delay?: number;
    accentColor?: string;
    style?: React.CSSProperties;
}

export const FloatingPill: React.FC<FloatingPillProps> = ({
    label,
    icon,
    delay = 0,
    accentColor = "#D4AF37",
    style = {},
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 12,
            stiffness: 120,
            mass: 0.8,
        },
    });

    const opacity = spring({
        frame: frame - delay,
        fps,
        config: { damping: 20 },
    });

    if (frame < delay) return null;

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(22, 22, 28, 0.75)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid rgba(255, 255, 255, 0.16)`,
                boxShadow: `0 10px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
                transform: `scale(${scale})`,
                opacity,
                ...style,
            }}
        >
            {icon && <span style={{ color: accentColor, display: "flex", alignItems: "center" }}>{icon}</span>}
            <span
                style={{
                    color: "#F4F4F5",
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </span>
        </div>
    );
};
