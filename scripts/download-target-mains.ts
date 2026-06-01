import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import https from 'https'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
    console.error('Missing env vars')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const targetProducts = [
    { title: "The Archive Cable Knit Zip", filename: "the_archive_cable_knit_zip_main.png" },
    { title: "The Tailored Gurkha Trouser", filename: "the_tailored_gurkha_trouser_main.png" },
    { title: "The Voyager Leather Duffel", filename: "the_voyager_leather_duffel_main.png" },
    { title: "The Heritage Chronograph", filename: "the_heritage_chronograph_main.png" },
    { title: "The Weekender", filename: "the_weekender_main.png" },
    { title: "The Hamptons Weekend Edit", filename: "the_hamptons_weekend_edit_main.png" },
    { title: "The Amalfi Stripe", filename: "the_amalfi_stripe_main.png" },
    { title: "The Sterling Cashmere Vest", filename: "the_sterling_cashmere_vest_main.png" },
    { title: "The Mediterranean Retreat Edit", filename: "the_mediterranean_retreat_edit_main.png" }
]

const DOWNLOAD_DIR = path.resolve(process.cwd(), 'public/images/original_mains')

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })
}

async function downloadImage(url: string, filename: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const dest = path.join(DOWNLOAD_DIR, filename)
        const file = fs.createWriteStream(dest)
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`))
                return
            }
            response.pipe(file)
            file.on('finish', () => {
                file.close()
                console.log(`Downloaded: ${filename}`)
                resolve()
            })
        }).on('error', (err) => {
            fs.unlink(dest, () => { })
            console.error(`Error downloading ${filename}: ${err.message}`)
            reject(err)
        })
    })
}

async function main() {
    const titles = targetProducts.map(p => p.title)
    const query = `*[_type == "product" && title in $titles]{
        title,
        "imageUrl": variants[0].images[0].asset->url
    }`
    
    try {
        const results = await client.fetch(query, { titles })
        console.log(`Found ${results.length} products to download.`)
        
        for (const item of results) {
            const match = targetProducts.find(p => p.title.toLowerCase() === item.title.toLowerCase())
            if (match && item.imageUrl) {
                await downloadImage(item.imageUrl, match.filename)
            } else {
                console.log(`Skipping or missing imageUrl for: ${item.title}`)
            }
        }
        console.log("All target main images downloaded successfully!")
    } catch (err) {
        console.error("Error in downloader:", err)
    }
}

main()
