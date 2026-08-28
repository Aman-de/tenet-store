import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../styles/remotion.css";

export const TenetJhumkaPoster: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#0A0908",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "80px 48px 70px 48px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Ambient Glow & Silk Gradients */}
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 900,
                    height: 900,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224, 169, 109, 0.22) 0%, rgba(0, 0, 0, 0) 70%)",
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }}
            />

            {/* Subtle Luxury Outer Border Frame */}
            <div
                style={{
                    position: "absolute",
                    inset: 24,
                    border: "1px solid rgba(224, 169, 109, 0.35)",
                    borderRadius: 40,
                    pointerEvents: "none",
                }}
            />

            {/* ============================================================ */}
            {/* 🌟 1. TOP HEADER: TENET BRANDING & 15-MIN EXPRESS BADGE      */}
            {/* ============================================================ */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    zIndex: 20,
                }}
            >
                {/* 15-MIN EXPRESS DELIVERY BADGE */}
                <div
                    style={{
                        padding: "10px 32px",
                        borderRadius: 99,
                        background: "linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)",
                        color: "#FFFFFF",
                        fontSize: 15,
                        fontWeight: 900,
                        letterSpacing: "0.14em",
                        boxShadow: "0 0 35px rgba(255, 69, 0, 0.65)",
                        marginBottom: 16,
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span>⚡</span> 15-MIN EXPRESS DELIVERY
                </div>

                {/* TENET PURE BRANDING */}
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 54,
                        fontWeight: 800,
                        letterSpacing: "0.28em",
                        color: "#F3D8A2",
                        textTransform: "uppercase",
                        margin: "0 0 6px 0",
                        textShadow: "0 4px 30px rgba(224, 169, 109, 0.4)",
                    }}
                >
                    TENET
                </h1>

                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        color: "rgba(255, 255, 255, 0.7)",
                        textTransform: "uppercase",
                    }}
                >
                    💛 PYAARI BAHNA FESTIVE JHUMKA EDIT
                </div>
            </div>

            {/* ============================================================ */}
            {/* 📸 2. MIDDLE HERO IMAGE: EXACT USER JHUMKA 4-TIER BOX        */}
            {/* ============================================================ */}
            <div
                style={{
                    width: "100%",
                    height: 1040,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "2px solid rgba(224, 169, 109, 0.6)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.95), 0 0 45px rgba(224,169,109,0.25)",
                    position: "relative",
                    backgroundColor: "#161310",
                    zIndex: 10,
                }}
            >
                <Img
                    src={staticFile("/images/products/jhumka-collection/jhumka-set-oxidized.jpg")}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />

                {/* Floating Micro-Badge Top Left */}
                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: "rgba(10, 8, 6, 0.85)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(224, 169, 109, 0.5)",
                        color: "#F3D8A2",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                    }}
                >
                    ✨ 24+ Designer Pairs Included
                </div>

                {/* Bottom Overlay Pill Inside Card */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        right: 20,
                        padding: "14px 22px",
                        borderRadius: 22,
                        background: "rgba(12, 10, 8, 0.9)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(224, 169, 109, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
                        Oxidized Silver Velvet Keepsake
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#E0A96D", letterSpacing: "0.1em" }}>
                        PREMIUM FINISH
                    </span>
                </div>
            </div>

            {/* ============================================================ */}
            {/* 🔥 3. BOTTOM FOOTER: DISCOUNT OFFER & "SHOP NOW" BUTTON      */}
            {/* ============================================================ */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    zIndex: 20,
                }}
            >
                {/* DISCOUNT BANNER FRAME */}
                <div
                    style={{
                        padding: "12px 36px",
                        borderRadius: 20,
                        background: "rgba(224, 169, 109, 0.12)",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        backdropFilter: "blur(14px)",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 20,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 26,
                            fontWeight: 800,
                            color: "#FFFFFF",
                        }}
                    >
                        FLAT 30% OFF
                    </span>
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#E0A96D",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 900,
                            letterSpacing: "0.15em",
                            color: "#E0A96D",
                        }}
                    >
                        CODE: RAKHI30
                    </span>
                </div>

                {/* HIGH CONVERTING GOLD "SHOP NOW" BUTTON */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: 580,
                        padding: "20px 48px",
                        borderRadius: 99,
                        background: "linear-gradient(135deg, #F7DF95 0%, #E0A96D 50%, #C48847 100%)",
                        color: "#080706",
                        fontSize: 24,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        boxShadow: "0 15px 45px rgba(224, 169, 109, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                    }}
                >
                    <span>SHOP NOW</span>
                    <span style={{ fontSize: 24 }}>→</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};
