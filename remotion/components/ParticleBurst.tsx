import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ParticleBurstProps {
    count?: number;
    color?: string;
    secondaryColor?: string;
    delay?: number;
    centerX?: number;
    centerY?: number;
}

interface Particle {
    angle: number;
    distance: number;
    size: number;
    speed: number;
    isGolden: boolean;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
    count = 45,
    color = "#D4AF37",
    secondaryColor = "#FFF6E5",
    delay = 0,
    centerX = 540,
    centerY = 960,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const particles: Particle[] = useMemo(() => {
        const arr: Particle[] = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const distance = 180 + Math.random() * 450;
            const size = 4 + Math.random() * 8;
            const speed = 0.8 + Math.random() * 0.5;
            const isGolden = Math.random() > 0.3;
            arr.push({ angle, distance, size, speed, isGolden });
        }
        return arr;
    }, [count]);

    const activeFrame = frame - delay;
    if (activeFrame < 0 || activeFrame > 40) return null;

    const progress = interpolate(activeFrame, [0, 35], [0, 1], {
        extrapolateRight: "clamp",
    });

    const globalOpacity = interpolate(activeFrame, [0, 10, 35], [1, 1, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                top: centerY,
                left: centerX,
                width: 0,
                height: 0,
                pointerEvents: "none",
                zIndex: 40,
            }}
        >
            {/* Core Flash Ring */}
            <div
                style={{
                    position: "absolute",
                    top: -150,
                    left: -150,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${secondaryColor} 0%, ${color} 40%, transparent 70%)`,
                    transform: `scale(${interpolate(activeFrame, [0, 20], [0.2, 3.5])})`,
                    opacity: interpolate(activeFrame, [0, 8, 25], [1, 0.7, 0], {
                        extrapolateRight: "clamp",
                    }),
                    filter: "blur(20px)",
                }}
            />

            {/* Individual Flying Spark Particles */}
            {particles.map((p, i) => {
                const currentDistance = p.distance * Math.pow(progress * p.speed, 0.7);
                const x = Math.cos(p.angle) * currentDistance;
                const y = Math.sin(p.angle) * currentDistance;
                const scale = interpolate(activeFrame, [0, 15, 35], [1.5, 1, 0], {
                    extrapolateRight: "clamp",
                });

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: y,
                            left: x,
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            backgroundColor: p.isGolden ? color : secondaryColor,
                            boxShadow: `0 0 12px ${p.isGolden ? color : secondaryColor}`,
                            opacity: globalOpacity,
                            transform: `translate(-50%, -50%) scale(${scale})`,
                        }}
                    />
                );
            })}
        </div>
    );
};
