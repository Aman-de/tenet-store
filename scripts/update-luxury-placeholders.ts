import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const CURRENT_BRAIN_DIR = '/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f'
const E2AD_DIR = '/Users/uditsharma/.gemini/antigravity/brain/e2adc946-4afc-4cb4-a6fc-6fea5425392a'

async function uploadImage(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`)
        return null
    }
    const buffer = fs.readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, {
        filename: path.basename(filePath)
    })
    console.log(`📸 Uploaded asset: ${path.basename(filePath)} -> ${asset._id}`)
    return asset._id
}

async function main() {
    console.log('🚀 Updating Aspen and Highland hero placeholders...')

    // 1. Update The Aspen Chalet Edit
    const aspenHeroPath = path.join(CURRENT_BRAIN_DIR, 'aspen_chalet_hero_1779437969711.png')
    const aspenFlatPath = path.join(E2AD_DIR, 'flat_aspen_m_1_1770668670504.png')

    const aspenHeroAssetId = await uploadImage(aspenHeroPath)
    let aspenFlatAssetId = await uploadImage(aspenFlatPath)

    const aspenDoc = await client.fetch(`*[_type == "product" && slug.current == "the-aspen-chalet-edit"][0]`)
    if (aspenDoc && aspenHeroAssetId) {
        // Keep the original second image if flat lay was not found or failed
        const existingFlatRef = aspenDoc.variants?.[0]?.images?.[1]?.asset?._ref
        const finalFlatRef = aspenFlatAssetId || existingFlatRef

        const newImages = [
            { _type: 'image', asset: { _type: 'reference', _ref: aspenHeroAssetId } }
        ]
        if (finalFlatRef) {
            newImages.push({ _type: 'image', asset: { _type: 'reference', _ref: finalFlatRef } })
        }

        await client.patch(aspenDoc._id).set({
            variants: [
                {
                    ...aspenDoc.variants[0],
                    images: newImages
                }
            ]
        }).commit()
        console.log('✅ Updated The Aspen Chalet Edit!')
    } else {
        console.error('❌ Could not update The Aspen Chalet Edit')
    }

    // 2. Update The Highland Estate Edit
    const highlandHeroPath = path.join(CURRENT_BRAIN_DIR, 'highland_estate_hero_new_1779438426699.png')
    const highlandHeroAssetId = await uploadImage(highlandHeroPath)

    const highlandDoc = await client.fetch(`*[_type == "product" && slug.current == "the-highland-estate-edit"][0]`)
    if (highlandDoc && highlandHeroAssetId) {
        const existingFlatRef = highlandDoc.variants?.[0]?.images?.[1]?.asset?._ref
        const newImages = [
            { _type: 'image', asset: { _type: 'reference', _ref: highlandHeroAssetId } }
        ]
        if (existingFlatRef) {
            newImages.push({ _type: 'image', asset: { _type: 'reference', _ref: existingFlatRef } })
        }

        await client.patch(highlandDoc._id).set({
            variants: [
                {
                    ...highlandDoc.variants[0],
                    images: newImages
                }
            ]
        }).commit()
        console.log('✅ Updated The Highland Estate Edit!')
    } else {
        console.error('❌ Could not update The Highland Estate Edit')
    }
}

main().catch(console.error)
