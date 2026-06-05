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
    console.log('🚀 Uploading pleated wool trouser images to Sanity...')

    const greyAltPath = path.join(process.cwd(), 'public/images/generated/pleated_wool_trouser_grey_alt.webp')
    const greyThirdPath = path.join(process.cwd(), 'public/images/generated/pleated_wool_trouser_grey_third.webp')
    const charcoalAltPath = path.join(process.cwd(), 'public/images/generated/pleated_wool_trouser_charcoal_alt.webp')
    const charcoalThirdPath = path.join(process.cwd(), 'public/images/generated/pleated_wool_trouser_charcoal_third.webp')

    const greyAltId = await uploadFileToSanity(greyAltPath, 'pleated_wool_trouser_grey_alt.png')
    const greyThirdId = await uploadFileToSanity(greyThirdPath, 'pleated_wool_trouser_grey_third.png')
    const charcoalAltId = await uploadFileToSanity(charcoalAltPath, 'pleated_wool_trouser_charcoal_alt.png')
    const charcoalThirdId = await uploadFileToSanity(charcoalThirdPath, 'pleated_wool_trouser_charcoal_third.png')

    if (!greyAltId || !greyThirdId || !charcoalAltId || !charcoalThirdId) {
        console.error('❌ Failed to upload one or more trouser assets to Sanity.')
        process.exit(1)
    }

    console.log('\n🔗 Fetching Pleated Wool Trouser from Sanity...')
    const product = await client.fetch(`*[_type == "product" && slug.current == "the-pleated-wool-trouser"][0]`)

    if (!product) {
        console.error('❌ Product "the-pleated-wool-trouser" not found in Sanity database.')
        process.exit(1)
    }

    const updatedVariants = product.variants.map((v: any) => {
        const colorName = v.colorName || ''
        const baseImages = [...(v.images || [])]

        if (colorName === 'Heather Grey') {
            console.log(`🔗 Updating variant "Heather Grey" with new angles...`)
            return {
                ...v,
                images: [
                    baseImages[0] || null,
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: greyAltId }
                    },
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: greyThirdId }
                    }
                ].filter(Boolean)
            }
        } else if (colorName === 'Charcoal') {
            console.log(`🔗 Updating variant "Charcoal" with new angles...`)
            return {
                ...v,
                images: [
                    baseImages[0] || null,
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: charcoalAltId }
                    },
                    {
                        _type: 'image',
                        _key: genKey(),
                        asset: { _type: 'reference', _ref: charcoalThirdId }
                    }
                ].filter(Boolean)
            }
        }
        return v
    })

    console.log('\n💾 Committing changes to Sanity...')
    await client.patch(product._id).set({ variants: updatedVariants }).commit()
    console.log('🎉 Successfully uploaded and linked all Pleated Wool Trouser images!')
}

main().catch(console.error)
