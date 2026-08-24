# TENET Remotion Video Engine 🎬✨

High-converting, viral-ready 9:16 Instagram Reels / TikTok / Shorts video generator tailored for TENET product sets and combos (e.g. **Top + Bottom = The Perfect Look**).

---

## 📐 Video Specs & Format
- **Format**: 9:16 Vertical Video (`1080 x 1920`)
- **Framerate**: `30 FPS`
- **Flagship Duration**: 360 Frames (`12.0 Seconds`)
- **Fast Promo Cut**: 180 Frames (`6.0 Seconds`)
- **Output**: H.264 MP4 with optimal Instagram / TikTok bitrate and color profiles

---

## ⚡ Narrative Arc (Viral Formula)

1. **Scene 1: Step 01 • The Top Piece (0.0s – 2.5s)**
   - Bold kinetic typography & huge background watermark.
   - High-resolution actual product cutout floating in with smooth spring entrance, subtle 3D hovering tilt, and soft realistic shadow.
   - Detail pills: Material composition, colorway name, price badge.

2. **Scene 2: Step 02 • The Bottom Piece (2.5s – 5.0s)**
   - Fast dynamic slide-in: `+ NOW ADD THIS BOTTOM`.
   - Complementary product image with fabric weight badge, rinse specs, price.
   - Mini thumbnail indicator: `+ Pairs with [Top Name]`.

3. **Scene 3: The Equation / Synergy Clash (5.0s – 7.0s)**
   - Kinetic equation: `[TOP] + [BOTTOM] = PURE CHEMISTRY`.
   - Pulsing golden `+` operator.
   - Magnetic snap collision into the center triggering a **golden particle burst** and white/gold flash transition.

4. **Scene 4: The Full Set Reveal / On-Model (7.0s – 10.0s)**
   - Flash morphs into the actual full set look (flat-lay or on-model editorial).
   - Cinematic slow-push zoom (`scale 1.0 -> 1.07`).
   - Bundle pricing bar (`₹12,900` vs crossed out `₹15,200` + `SAVE ₹2,300 AS A SET`).
   - `COMPLETE 2-PIECE SET` verification tag.

5. **Scene 5: Outro & Call to Action (10.0s – 12.0s)**
   - TENET minimalist luxury logo with metallic light reflection sweep.
   - Promo discount code box (`USE CODE: SETLOOK`).
   - Interactive pulsing CTA button (`SHOP THE FULL COMBO →`).
   - Trust guarantees (Express Shipping • 7-Day Easy Returns).

---

## 🚀 Quick Commands

### 1. Launch Remotion Studio Preview (Interactive Web UI)
Preview all compositions in real-time, scrub the timeline, inspect frames, and edit props live:
```bash
npm run remotion:preview
```

### 2. Render Flagship Video (Chocolate Knit + Denim Set)
Renders the 1080x1920 MP4 to `out/chocolate-denim.mp4`:
```bash
npm run remotion:render
```

### 3. Render Fast 6-Second Cut
```bash
npm run remotion:render:fast
```

### 4. Render Other Ready-Made Presets
```bash
npm run remotion:render:amalfi    # Amalfi Striped Linen Shirt + Gurkha Trouser
npm run remotion:render:archive   # Archive Cable Knit + Minimalist Wool Trouser
```

### 5. Render a Single High-Resolution Still Frame
```bash
npm run remotion:still
```

---

## 🛠 Project Structure

```
tenet-store/
├── remotion/
│   ├── index.ts                      # Remotion entry point
│   ├── Root.tsx                      # Composition registry & presets
│   ├── types.ts                      # TypeScript interfaces
│   ├── data/
│   │   └── presets.ts                # Preset metadata (Chocolate+Denim, Amalfi, Archive Knit)
│   ├── compositions/
│   │   ├── ProductSetReel.tsx        # 12-second master 9:16 composition
│   │   └── FastPromoReel.tsx         # 6-second high-energy cut
│   ├── components/
│   │   ├── Background.tsx            # Fluid mesh gradient, ambient orbs & vignette
│   │   ├── BrandHeader.tsx           # Luxury header with animated underline
│   │   ├── TopScene.tsx              # Scene 1: Top piece reveal
│   │   ├── BottomScene.tsx           # Scene 2: Bottom piece reveal
│   │   ├── EquationScene.tsx         # Scene 3: Magnetic synergy clash & flash
│   │   ├── FullLookScene.tsx         # Scene 4: Full outfit reveal & bundle pricing
│   │   ├── OutroScene.tsx            # Scene 5: Logo shine & CTA button
│   │   ├── ParticleBurst.tsx         # Radial particle explosion effect
│   │   └── FloatingPill.tsx          # Glassmorphic pill badges
│   └── styles/
│       └── remotion.css              # Custom fonts, keyframes & glassmorphism
```

---

## 🎨 How to Add New Product Combos

Add your set to `remotion/data/presets.ts` and register it in `remotion/Root.tsx`:

```typescript
import { staticFile } from "remotion";
import { ProductSetVideoProps } from "./types";

export const myNewSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "SUMMER 2026",
    top: {
        name: "Breezy Linen Shirt",
        image: staticFile("/images/generated/breezy_linen_shirt_main.webp"),
        price: "₹4,500",
        details: ["100% French Linen"],
        colorName: "Crisp White",
        colorHex: "#FFFFFF",
    },
    bottom: {
        name: "Riviera Linen Short",
        image: staticFile("/images/generated/riviera_linen_short_new_main.webp"),
        price: "₹3,800",
        details: ["Relaxed Drawstring"],
        colorName: "Sand Beige",
        colorHex: "#D8C7B0",
    },
    fullSet: {
        title: "The Riviera Linen Set",
        image: staticFile("/images/generated/capri_edit_main.webp"),
        setPrice: "₹7,200",
        originalPrice: "₹8,300",
        savingsText: "SAVE ₹1,100 AS A SET",
    },
};
```
