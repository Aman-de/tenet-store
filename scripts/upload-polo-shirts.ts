import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing env var: SANITY_API_TOKEN')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const genKey = () => Math.random().toString(36).slice(2, 9)

async function uploadFileToSanity(filePath: string, filename: string): Promise<string | null> {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Local file not found: ${filePath}`)
        return null
    }
    try {
        const buffer = fs.readFileSync(filePath)
        const asset = await client.assets.upload('image', buffer, { filename })
        console.log(`✅ Uploaded asset ${filename} successfully. ID: ${asset._id}`)
        return asset._id
    } catch (err) {
        console.error(`❌ Failed to upload asset ${filename}:`, err)
        return null
    }
}

async function main() {
    console.log('🚀 Uploading pique polo images to Sanity...')

    const whiteThirdPath = path.join(process.cwd(), 'public/images/generated/classic_pique_polo_white_third.png')
    const blackThirdPath = path.join(process.cwd(), 'public/images/generated/classic_pique_polo_black_third.png')
    const navyAltPath = path.join(process.cwd(), 'public/images/generated/classic_pique_polo_navy_alt.png')
    const navyThirdPath = path.join(process.cwd(), 'public/images/generated/classic_pique_polo_navy_third.png')

    const whiteThirdId = await uploadFileToSanity(whiteThirdPath, 'classic_pique_polo_white_third.png')
    const blackThirdId = await uploadFileToSanity(blackThirdPath, 'classic_pique_polo_black_third.png')
    const navyAltId = await uploadFileToSanity(navyAltPath, 'classic_pique_polo_navy_alt.png')
    const navyThirdId = await uploadFileToSanity(navyThirdPath, 'classic_pique_polo_navy_third.png')

    if (!whiteThirdId || !blackThirdId || !navyAltId || !navyThirdId) {
        console.error('❌ Failed to upload one or more polo assets to Sanity.')
        process.exit(1)
    }

    console.log('\n🔗 Fetching Classic Pique Polo from Sanity...')
    const product = await client.fetch(`*[_type == "product" && slug.current == "classic-pique-polo"][0]`)

    if (!product) {
        console.error('❌ Product "classic-pique-polo" not found in Sanity database.')
        process.exit(1)
    }

    const updatedVariants = product.variants.map((v: any) => {
        const colorName = v.colorName || ''
        const baseImages = [...(v.images || [])]

        if (colorName === 'Classic White') {
            console.log(`🔗 Updating variant "Classic White" with 3rd image...`)
            return {
                ...v,
                images: [
                    baseImages[0] || null,
                    baseImages[1] || null,
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: whiteThirdId }
                    }
                ].filter(Boolean)
            }
        } else if (colorName === 'Jet Black') {
            console.log(`🔗 Updating variant "Jet Black" with 3rd image...`)
            return {
                ...v,
                images: [
                    baseImages[0] || null,
                    baseImages[1] || null,
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: blackThirdId }
                    }
                ].filter(Boolean)
            }
        } else if (colorName === 'Royal Navy') {
            console.log(`🔗 Updating variant "Royal Navy" with 2nd and 3rd images...`)
            return {
                ...v,
                images: [
                    baseImages[0] || null,
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: navyAltId }
                    },
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: navyThirdId }
                    }
                ].filter(Boolean)
            }
        }
        return v
    })

    console.log('\n💾 Committing changes to Sanity...')
    await client.patch(product._id).set({ variants: updatedVariants }).commit()
    console.log('🎉 Successfully uploaded and linked all Classic Pique Polo images!')
}

main().catch(console.error)
