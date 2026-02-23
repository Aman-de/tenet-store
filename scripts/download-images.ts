
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { start } from 'repl'

dotenv.config({ path: '.env.local' })

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
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

const DOWNLOAD_DIR = path.resolve(process.cwd(), 'tenet-all-pic')

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR)
}

async function downloadImage(url: string, filename: string) {
    return new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(path.join(DOWNLOAD_DIR, filename))
        https.get(url, (response) => {
            response.pipe(file)
            file.on('finish', () => {
                file.close()
                console.log(`Downloaded: ${filename}`)
                resolve()
            })
        }).on('error', (err) => {
            fs.unlink(path.join(DOWNLOAD_DIR, filename), () => { })
            console.error(`Error downloading ${filename}: ${err.message}`)
            reject(err)
        })
    })
}

async function main() {
    try {
        console.log("Fetching products...")
        const products = await client.fetch(`*[_type == "product"]{
            title,
            variants[]{
                colorName,
                images[].asset->url
            }
        }`)

        console.log(`Found ${products.length} products.`)

        let downloadCount = 0
        const promises: Promise<void>[] = []

        for (const product of products) {
            const productTitle = product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() // Sanitize title

            if (product.variants) {
                for (const variant of product.variants) {
                    const colorName = variant.colorName ? variant.colorName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'default'

                    if (variant.images) {
                        variant.images.forEach((imageUrl: string, index: number) => {
                            if (imageUrl) {
                                const ext = path.extname(imageUrl).split('?')[0] || '.jpg'
                                const filename = `${productTitle}-${colorName}-${index + 1}${ext}`
                                promises.push(downloadImage(imageUrl, filename))
                                downloadCount++
                            }
                        })
                    }
                }
            }
        }

        await Promise.all(promises)
        console.log(`\nSuccessfully downloaded ${downloadCount} images to ${DOWNLOAD_DIR}`)

    } catch (error) {
        console.error("Error in main:", error)
    }
}

main()
