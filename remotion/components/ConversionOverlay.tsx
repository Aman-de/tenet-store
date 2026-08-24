import React from "react";
import { useCurrentFrame } from "remotion";

interface ConversionOverlayProps {
    ctaPillText?: string;
    accentColor?: string;
    showWebsite?: boolean;
}

export const ConversionOverlay: React.FC<ConversionOverlayProps> = ({
    ctaPillText = 'COMMENT "LINK" FOR DM ✨',
    accentColor = "#E0A96D",
    showWebsite = true,
}) => {
    const frame = useCurrentFrame();
    const pulse = 1 + Math.sin(frame * 0.25) * 0.035;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 290,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                zIndex: 40,
            }}
        >
            <div
                style={{
                    transform: `scale(${pulse})`,
                    padding: "14px 36px",
                    borderRadius: 99,
                    background: accentColor,
                    boxShadow: `0 10px 30px ${accentColor}55`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span
                    style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 20,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        color: "#0A0908",
                        textTransform: "uppercase",
                    }}
                >
                    {ctaPillText}
                </span>
            </div>

            {showWebsite && (
                <span
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: "0.3em",
                        color: "rgba(255, 255, 255, 0.55)",
                        textTransform: "uppercase",
                    }}
                >
                    tenet
                </span>
            )}
        </div>
    );
};
