
import fs from 'fs'
import path from 'path'
import os from 'os'

const SOURCE_DIR = "/Users/uditsharma/.gemini/antigravity/brain/d39e1348-70d3-427e-a75b-a1f9a71e451b"
const TARGET_DIR_NAME = "tenet-images"

// Define the mapping of source specific files to clean destination names
const filesToCopy = [
    // Set 1: Yacht Club
    { src: "flat_yacht_club_1770239400350.png", dest: "Set_1_Yacht_Club_Flat.png" },
    { src: "hero_yacht_club_1770239426661.png", dest: "Set_1_Yacht_Club_Hero.png" },

    // Set 2: Polo Ground
    { src: "flat_polo_ground_1770239493451.png", dest: "Set_2_Polo_Ground_Flat.png" },
    { src: "hero_polo_ground_1770239520328.png", dest: "Set_2_Polo_Ground_Hero.png" },

    // Set 3: Riviera Sunset
    { src: "flat_riviera_sunset_1770239568953.png", dest: "Set_3_Riviera_Sunset_Flat.png" },
    { src: "hero_riviera_sunset_1770239594741.png", dest: "Set_3_Riviera_Sunset_Hero.png" },

    // Set 4: Alpine Lodge
    { src: "flat_alpine_lodge_1770240376904.png", dest: "Set_4_Alpine_Lodge_Flat.png" },
    { src: "hero_alpine_lodge_1770240393686.png", dest: "Set_4_Alpine_Lodge_Hero.png" },

    // Set 5: Savannah Explorer
    { src: "flat_savannah_explorer_1770240440949.png", dest: "Set_5_Savannah_Explorer_Flat.png" },
    { src: "hero_savannah_explorer_1770240457660.png", dest: "Set_5_Savannah_Explorer_Hero.png" },

    // Set 6: Manhattan Evening
    { src: "flat_manhattan_evening_1770240506927.png", dest: "Set_6_Manhattan_Evening_Flat.png" },
    { src: "hero_manhattan_evening_1770240522517.png", dest: "Set_6_Manhattan_Evening_Hero.png" },

    // Set 7: Country Club
    { src: "flat_country_club_1770240572451.png", dest: "Set_7_Country_Club_Flat.png" },
    { src: "hero_country_club_1770240588432.png", dest: "Set_7_Country_Club_Hero.png" },

    // Set 8: Highland Estate (Only Flat available)
    { src: "flat_highland_estate_1770241977609.png", dest: "Set_8_Highland_Estate_Flat.png" },

    // Summer Collection
    { src: "summer_collection_combo_1770238522254.png", dest: "Summer_Collection_Flat.png" },
    { src: "hero_summer_collection_model_1770238924433.png", dest: "Summer_Collection_Hero.png" },

    // New Summer Sets (Expansion)
    { srcPrefix: "flat_amalfi_day", dest: "Set_Amalfi_Day_Flat.png" },
    { srcPrefix: "hero_amalfi_day", dest: "Set_Amalfi_Day_Hero.png" },
    { srcPrefix: "flat_santorini_sunset", dest: "Set_Santorini_Sunset_Flat.png" },
    { srcPrefix: "hero_santorini_sunset", dest: "Set_Santorini_Sunset_Hero.png" },
    { srcPrefix: "flat_capri_evening", dest: "Set_Capri_Evening_Flat.png" },
    { srcPrefix: "hero_capri_evening", dest: "Set_Capri_Evening_Hero.png" },

    // Round 2 Summer Sets
    { srcPrefix: "flat_havana_lounge", dest: "Set_Havana_Lounge_Flat.png" },
    { srcPrefix: "hero_havana_lounge", dest: "Set_Havana_Lounge_Hero.png" },
    { srcPrefix: "flat_mykonos_day_club", dest: "Set_Mykonos_Day_Club_Flat.png" },
    { srcPrefix: "hero_mykonos_day_club", dest: "Set_Mykonos_Day_Club_Hero.png" },
    { srcPrefix: "flat_st_tropez_promenade", dest: "Set_St_Tropez_Promenade_Flat.png" },
    { srcPrefix: "hero_st_tropez_promenade", dest: "Set_St_Tropez_Promenade_Hero.png" },

    // Round 3 Summer Sets
    { srcPrefix: "flat_hamptons_weekend", dest: "Set_Hamptons_Weekend_Flat.png" },
    { srcPrefix: "hero_hamptons_weekend", dest: "Set_Hamptons_Weekend_Hero.png" },
    { srcPrefix: "flat_monaco_grand_prix", dest: "Set_Monaco_Grand_Prix_Flat.png" },
    { srcPrefix: "hero_monaco_grand_prix", dest: "Set_Monaco_Grand_Prix_Hero.png" },
    { srcPrefix: "flat_tulum_eco_luxe", dest: "Set_Tulum_Eco_Luxe_Flat.png" },
    { srcPrefix: "hero_tulum_eco_luxe", dest: "Set_Tulum_Eco_Luxe_Hero.png" },

    // Round 4 Summer Sets
    { srcPrefix: "flat_lake_como_villa", dest: "Set_Lake_Como_Villa_Flat.png" },
    { srcPrefix: "hero_lake_como_villa", dest: "Set_Lake_Como_Villa_Hero.png" },
    { srcPrefix: "flat_ibiza_boho", dest: "Set_Ibiza_Boho_Flat.png" },
    { srcPrefix: "hero_ibiza_boho", dest: "Set_Ibiza_Boho_Hero.png" },
    { srcPrefix: "flat_maldives_resort", dest: "Set_Maldives_Resort_Flat.png" },
    { srcPrefix: "hero_maldives_resort", dest: "Set_Maldives_Resort_Hero.png" },

    // Other assets
    { src: "flat_chelsea_boot_1770228040345.png", dest: "Asset_Chelsea_Boot_Flat.png" },
    { src: "hero_chelsea_boot_1770211079147.png", dest: "Asset_Chelsea_Boot_Hero.png" },
    { src: "flat_merino_turtleneck_1770227985744.png", dest: "Asset_Merino_Turtleneck_Flat.png" },
    { src: "hero_merino_turtleneck_1770210993042.png", dest: "Asset_Merino_Turtleneck_Hero.png" },
    { src: "flat_oxford_shirt_1770228013702.png", dest: "Asset_Oxford_Shirt_Flat.png" },
    { src: "hero_oxford_shirt_1770211029858.png", dest: "Asset_Oxford_Shirt_Hero.png" },
    { src: "hero_oxford_shirt_1770211029858.png", dest: "Asset_Oxford_Shirt_Hero.png" },
]

function exportImages() {
    // Try to find Downloads folder
    const homeDir = os.homedir()
    const downloadsDir = path.join(homeDir, "Downloads")

    let targetDir = ""

    if (fs.existsSync(downloadsDir)) {
        targetDir = path.join(downloadsDir, TARGET_DIR_NAME)
    } else {
        // Fallback to local workspace
        console.log("⚠️ Downloads folder not found. Exporting to workspace instead.")
        targetDir = path.join(process.cwd(), TARGET_DIR_NAME)
    }

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    console.log(`🚀 Exporting images to: ${targetDir}`)

    let count = 0
    for (const file of filesToCopy) {
        let srcPath = ""

        if ('src' in file && file.src) {
            srcPath = path.join(SOURCE_DIR, file.src)
        } else if ('srcPrefix' in file && file.srcPrefix) {
            // Find file with prefix
            const files = fs.readdirSync(SOURCE_DIR)
            const match = files.find(f => f.startsWith(file.srcPrefix!) && f.endsWith('.png'))
            if (match) {
                srcPath = path.join(SOURCE_DIR, match)
            }
        }

        const destPath = path.join(targetDir, file.dest)

        if (srcPath && fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath)
            console.log(`   ✅ Copied: ${file.dest}`)
            count++
        } else {
            console.log(`   ⚠️ Source not found: ${'src' in file ? file.src : file.srcPrefix}`)
        }
    }

    console.log(`\n🎉 Successfully exported ${count} images!`)
}

exportImages()
