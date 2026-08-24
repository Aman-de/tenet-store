import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface BackgroundProps {
    bgStart?: string;
    bgEnd?: string;
    accentColor?: string;
    secondaryAccent?: string;
}

export const Background: React.FC<BackgroundProps> = ({
    bgStart = "#0D0A08",
    bgEnd = "#05070B",
    accentColor = "#D4AF37",
    secondaryAccent = "#B45309",
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Slow ambient breathing motion for orbs
    const orb1Y = interpolate(Math.sin(frame / 25), [-1, 1], [-40, 40]);
    const orb1Scale = interpolate(Math.sin(frame / 35), [-1, 1], [0.9, 1.15]);

    const orb2X = interpolate(Math.cos(frame / 30), [-1, 1], [-50, 50]);
    const orb2Scale = interpolate(Math.cos(frame / 40), [-1, 1], [0.85, 1.1]);

    const gridOpacity = interpolate(
        frame,
        [0, 30, durationInFrames - 30, durationInFrames],
        [0, 0.08, 0.08, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: bgStart,
                overflow: "hidden",
                zIndex: 0,
            }}
        >
            {/* Base Radial & Linear Gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at 50% 20%, ${bgStart} 0%, #08080A 60%, ${bgEnd} 100%)`,
                }}
            />

            {/* Glowing Ambient Light Orb 1 (Top / Warm) */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "20%",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor} 0%, rgba(212, 175, 55, 0) 70%)`,
                    opacity: 0.18,
                    filter: "blur(120px)",
                    transform: `translate(${orb2X}px, ${orb1Y}px) scale(${orb1Scale})`,
                    pointerEvents: "none",
                }}
            />

            {/* Glowing Ambient Light Orb 2 (Bottom / Cool or Accent) */}
            <div
                style={{
                    position: "absolute",
                    bottom: "15%",
                    right: "10%",
                    width: 800,
                    height: 800,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${secondaryAccent} 0%, rgba(180, 83, 9, 0) 70%)`,
                    opacity: 0.15,
                    filter: "blur(140px)",
                    transform: `translate(${-orb2X}px, ${-orb1Y}px) scale(${orb2Scale})`,
                    pointerEvents: "none",
                }}
            />

            {/* Subtle Luxury Grid Lines */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                    opacity: gridOpacity,
                    pointerEvents: "none",
                }}
            />

            {/* Cinematic Vignette */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.75) 100%)",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};
