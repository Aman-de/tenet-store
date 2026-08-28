import React from "react";
import {
    AbsoluteFill,
    Audio,
    Img,
    interpolate,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { ConversionOverlay } from "../components/ConversionOverlay";
import "../styles/remotion.css";

interface JhumkaQuickCTAProps {
    includeVoiceover?: boolean;
}

// =======================================================
// ULTRA FAST 3.3s CTA (100 frames @ 30fps)
// =======================================================
export const JhumkaUltraQuickCTA: React.FC<JhumkaQuickCTAProps> = ({
    includeVoiceover = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const beat1Entrance = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
    const beat2Entrance = spring({ frame: frame - 32, fps, config: { damping: 12, stiffness: 160 } });
    const beat3Entrance = spring({ frame: frame - 65, fps, config: { damping: 12, stiffness: 160 } });

    const pulse = interpolate(Math.sin(frame / 4), [-1, 1], [0.97, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Ambient Golden Spotlight */}
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 750,
                    height: 750,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.35) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Audio Layers */}
            <Audio src={staticFile("/audio/music/music-showdown-hype.mp3")} volume={0.2} />
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={32} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={65} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.5} />
            </Sequence>

            {/* TOP URGENCY BADGE */}
            <div
                style={{
                    position: "absolute",
                    top: 100,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 40,
                }}
            >
                <div
                    style={{
                        padding: "8px 28px",
                        borderRadius: 99,
                        background: "linear-gradient(90deg, #FF4500 0%, #FF8C00 100%)",
                        color: "#FFFFFF",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        boxShadow: "0 0 30px rgba(255, 69, 0, 0.6)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        transform: `scale(${pulse})`,
                    }}
                >
                    ⚡ 15-MIN EXPRESS DISPATCH
                </div>

                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    {frame < 32
                        ? "💛 Pyaari Bahna Box"
                        : frame < 65
                        ? "24+ Designer Jhumkas ✨"
                        : "Flat 30% OFF • Buy Now 🔥"}
                </h1>
            </div>

            {/* DYNAMIC CARD SHOWCASE */}
            {/* Beat 1: Velvet Box with perfect framing */}
            {frame < 32 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        borderRadius: 36,
                        overflow: "hidden",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${beat1Entrance})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(224,169,109,0.2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#100D0B",
                        padding: 12,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/jhumka-collection/pyaari-bahna-box.jpg")}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 24,
                            left: 20,
                            right: 20,
                            padding: "14px 20px",
                            borderRadius: 20,
                            background: "rgba(10, 8, 6, 0.88)",
                            backdropFilter: "blur(14px)",
                            border: "1px solid rgba(224, 169, 109, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
                            Luxury Velvet Keepsake Box 💛
                        </span>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900, color: "#E0A96D" }}>
                            FREE PACKAGING
                        </span>
                    </div>
                </div>
            )}

            {/* Beat 2: Open Jhumka Sets */}
            {frame >= 32 && frame < 65 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        display: "flex",
                        gap: 16,
                        zIndex: 10,
                        transform: `scale(${beat2Entrance})`,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                            position: "relative",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-oxidized.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: 16,
                                left: 12,
                                padding: "6px 14px",
                                borderRadius: 99,
                                background: "#E0A96D",
                                color: "#000",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 12,
                                fontWeight: 900,
                            }}
                        >
                            Oxidized Silver
                        </div>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                            position: "relative",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-colorful.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: 16,
                                left: 12,
                                padding: "6px 14px",
                                borderRadius: 99,
                                background: "#E0A96D",
                                color: "#000",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 12,
                                fontWeight: 900,
                            }}
                        >
                            Gem & Pearl Drops
                        </div>
                    </div>
                </div>
            )}

            {/* Beat 3: High Converting Climax */}
            {frame >= 65 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        display: "flex",
                        gap: 16,
                        zIndex: 10,
                        transform: `scale(${beat3Entrance})`,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#100D0B",
                            padding: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/pyaari-bahna-box.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    </div>

                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-oxidized.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>
            )}

            {/* BOTTOM HIGH CONVERTING CTA BUTTON */}
            <div
                style={{
                    position: "absolute",
                    bottom: 70,
                    left: 30,
                    right: 30,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        transform: `scale(${pulse})`,
                        background: "linear-gradient(135deg, #F5D77F 0%, #E0A96D 50%, #C88D4D 100%)",
                        color: "#080706",
                        padding: "18px 44px",
                        borderRadius: 99,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 21,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.55)",
                        textTransform: "uppercase",
                        textAlign: "center",
                    }}
                >
                    💬 Comment "JHUMKA" for DM ✨
                </div>

                <div
                    style={{
                        marginTop: 10,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 14,
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.75)",
                        textTransform: "uppercase",
                    }}
                >
                    TENET • USE CODE: RAKHI30
                </div>
            </div>
        </AbsoluteFill>
    );
};

// =======================================================
// FULL 8.3s JHUMKA PROMO CTA (249 frames @ 30fps)
// =======================================================
export const JhumkaExpressPromoCTA: React.FC<JhumkaQuickCTAProps> = ({
    includeVoiceover = true,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.98, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 750,
                    height: 750,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.3) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(50px)",
                }}
            />

            <Audio src={staticFile("/audio/music/music-showdown-hype.mp3")} volume={0.18} />

            <Sequence from={0} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={75} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={150} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={200} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>

            {includeVoiceover && (
                <Sequence from={0}>
                    <Audio src={staticFile("/audio/voiceovers/vo-jhumka-quick-cta.mp3")} volume={1.0} />
                </Sequence>
            )}

            {/* TOP KINETIC URGENCY BANNER */}
            <div
                style={{
                    position: "absolute",
                    top: 100,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 40,
                }}
            >
                <div
                    style={{
                        padding: "8px 28px",
                        borderRadius: 99,
                        background: "linear-gradient(90deg, #FF4500 0%, #FF8C00 100%)",
                        color: "#FFFFFF",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        boxShadow: "0 0 30px rgba(255, 69, 0, 0.6)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        transform: `scale(${pulse})`,
                    }}
                >
                    ⚡ 15-MIN EXPRESS DISPATCH
                </div>

                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    {frame < 80
                        ? "💛 Pyaari Bahna Box"
                        : frame < 160
                        ? "24+ Designer Jhumkas ✨"
                        : "Flat 30% OFF • Buy Now 🔥"}
                </h1>
            </div>

            {/* TIMELINE VISUALS */}
            {frame < 80 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        borderRadius: 36,
                        overflow: "hidden",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${entrance})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                        backgroundColor: "#100D0B",
                        padding: 12,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/jhumka-collection/pyaari-bahna-box.jpg")}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                </div>
            )}

            {frame >= 80 && frame < 160 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        display: "flex",
                        gap: 16,
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-oxidized.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-colorful.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>
            )}

            {frame >= 160 && (
                <div
                    style={{
                        position: "absolute",
                        top: 225,
                        left: 45,
                        right: 45,
                        height: 1270,
                        display: "flex",
                        gap: 16,
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#100D0B",
                            padding: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/pyaari-bahna-box.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    </div>

                    <div
                        style={{
                            flex: 1,
                            borderRadius: 32,
                            overflow: "hidden",
                            border: "1.5px solid rgba(224, 169, 109, 0.5)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                            backgroundColor: "#14110E",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/jhumka-collection/jhumka-set-oxidized.jpg")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                </div>
            )}

            {/* BOTTOM HIGH CONVERTING CTA BUTTON */}
            <div
                style={{
                    position: "absolute",
                    bottom: 70,
                    left: 30,
                    right: 30,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        transform: `scale(${pulse})`,
                        background: "linear-gradient(135deg, #F5D77F 0%, #E0A96D 50%, #C88D4D 100%)",
                        color: "#080706",
                        padding: "18px 44px",
                        borderRadius: 99,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 21,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.55)",
                        textTransform: "uppercase",
                        textAlign: "center",
                    }}
                >
                    💬 Comment "JHUMKA" for DM ✨
                </div>

                <div
                    style={{
                        marginTop: 10,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 14,
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.75)",
                        textTransform: "uppercase",
                    }}
                >
                    TENET • USE CODE: RAKHI30
                </div>
            </div>
        </AbsoluteFill>
    );
};
