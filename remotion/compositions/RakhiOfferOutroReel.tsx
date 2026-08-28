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

interface RakhiOfferOutroProps {
    includeVoiceover?: boolean;
}

// =======================================================
// BEAT 1: MINIMAL IVORY GIFT BOX & 30% OFF (0 - 110 frames / 3.66s)
// =======================================================
const MinimalIvoryBoxBeat: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
    const scale = interpolate(frame, [0, 110], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            {/* Soft Ambient Warm Sunlight */}
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

            {/* Top Kinetic Badges */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -18}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 26px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        boxShadow: "0 0 25px rgba(224, 169, 109, 0.5)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 FLAT 30% OFF • RAKHI SPECIAL
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    Free Luxury Gift Box 🎁
                </h1>
            </div>

            {/* Light Ivory Gift Box Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1.5px solid rgba(224, 169, 109, 0.45)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(224,169,109,0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#161310",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/minimal-ivory-rakhi-gift-box.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Bottom Glassmorphism Tag */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 24,
                        left: 20,
                        right: 20,
                        padding: "14px 20px",
                        borderRadius: 20,
                        background: "rgba(12, 10, 8, 0.88)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
                        Kurti + Gold Rakhi + Box ✨
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#E0A96D", letterSpacing: "0.1em" }}>
                        WORTH ₹799 (FREE)
                    </span>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Use Code: RAKHI30 ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// BEAT 2: GUARANTEED FAST DISPATCH & STOCK (110 - 220 frames / 3.66s)
// =======================================================
const FastDispatchBeat: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const card1 = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
    const card2 = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 24px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.18)",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#E0A96D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    ⚡ GUARANTEED FAST DISPATCH
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Pre-Rakhi Delivery 🚀
                </h1>
            </div>

            {/* 2-Column Split: Model + Handcrafted Bag */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 50,
                    right: 50,
                    height: 1260,
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
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card1})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#161310",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 16, left: 14, padding: "6px 14px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                        Tassel Kurti Set
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card2})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#161310",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/artisan-round-bag.jpg")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 16, left: 14, padding: "6px 14px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                        Artisan Bag
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='⏳ Limited Festive Stock' />
        </AbsoluteFill>
    );
};

// =======================================================
// BEAT 3: INTERACTIVE COMMENT "RAKHI" CALLOUT (220 - 320 frames / 3.33s)
// =======================================================
const CommentCalloutBeat: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.97, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 24px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    💬 INSTANT DM LINK
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Comment "RAKHI" Below 👇
                </h1>
            </div>

            {/* Central Light Box Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1.5px solid rgba(224, 169, 109, 0.45)",
                    transform: `scale(${entrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#161310",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/minimal-ivory-rakhi-gift-box.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Simulated Comment Bubble Overlay */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 30,
                        left: 20,
                        right: 20,
                        padding: "16px 24px",
                        borderRadius: 24,
                        background: "rgba(10, 8, 6, 0.92)",
                        backdropFilter: "blur(16px)",
                        border: "1.5px solid rgba(224, 169, 109, 0.6)",
                        transform: `scale(${pulse})`,
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 900, color: "#E0A96D", margin: "0 0 4px 0" }}>
                        Type "RAKHI" in comments ✨
                    </p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                        Direct discount link will be sent to your DM in 3 seconds!
                    </p>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// BEAT 4: FINAL HIGH-CONVERTING CLIMAX (320 - 426 frames / 3.53s)
// =======================================================
const ClimaxOutroBeat: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const buttonPulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.98, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `scale(${entrance})`,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 26px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        boxShadow: "0 0 25px rgba(224, 169, 109, 0.5)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 FLAT 30% OFF • LIMITED STOCK
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
                    Use Code: RAKHI30 ✨
                </h1>
            </div>

            {/* Side-by-Side: Ivory Gift Box + Sitting Kurti Model */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 50,
                    right: 50,
                    height: 1260,
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
                        backgroundColor: "#161310",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/minimal-ivory-rakhi-gift-box.png")}
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
                        backgroundColor: "#161310",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Bottom High-Converting Action Button */}
            <div
                style={{
                    position: "absolute",
                    bottom: 75,
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
                        transform: `scale(${buttonPulse})`,
                        background: "linear-gradient(135deg, #F5D77F 0%, #E0A96D 50%, #C88D4D 100%)",
                        color: "#080706",
                        padding: "18px 44px",
                        borderRadius: 99,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 21,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.5)",
                        textTransform: "uppercase",
                        textAlign: "center",
                    }}
                >
                    💬 Comment "RAKHI" for DM ✨
                </div>

                <div
                    style={{
                        marginTop: 10,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 15,
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "uppercase",
                    }}
                >
                    TENET
                </div>
            </div>
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER RAKHI OFFER OUTRO COMPOSITION (426 frames / 14.20s)
// =======================================================
export const RakhiOfferOutroReel: React.FC<RakhiOfferOutroProps> = ({
    includeVoiceover = false,
}) => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09" }}>
            {/* Subtle Luxury Music (Volume 0.18) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* Synced SFX Transitions */}
            <Sequence from={0} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={110} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={220} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={320} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>

            {/* Optional Voiceover Layer */}
            {includeVoiceover && (
                <Sequence from={0}>
                    <Audio
                        src={staticFile("/audio/voiceovers/vo-rakhi-offer-outro.mp3")}
                        volume={1.0}
                    />
                </Sequence>
            )}

            {/* Motion Graphics Timeline */}
            <Sequence from={0} durationInFrames={110}>
                <MinimalIvoryBoxBeat />
            </Sequence>
            <Sequence from={110} durationInFrames={110}>
                <FastDispatchBeat />
            </Sequence>
            <Sequence from={220} durationInFrames={100}>
                <CommentCalloutBeat />
            </Sequence>
            <Sequence from={320} durationInFrames={106}>
                <ClimaxOutroBeat />
            </Sequence>
        </AbsoluteFill>
    );
};
