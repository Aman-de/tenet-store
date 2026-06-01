import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

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

const BRAIN_DIR = "/Users/uditsharma/.gemini/antigravity/brain/03679ac0-5444-4ba8-ba5e-c367877c4b2f"

async function main() {
    console.log('🚀 Uploading newly generated premium campaign photos to Sanity...')

    // 1. Find the newly generated image files in the brain directory
    const files = fs.readdirSync(BRAIN_DIR)
    const denimFile = files.find(f => f.startsWith('selvedge_denim_model_angle_') && f.endsWith('.png'))
    const shortsFile = files.find(f => f.startsWith('linen_shorts_model_angle_') && f.endsWith('.png'))

    if (!denimFile || !shortsFile) {
        console.error('❌ Could not find the generated image files in the brain folder!')
        console.log('Files found:', files.filter(f => f.endsWith('.png')))
        process.exit(1)
    }

    console.log(`📸 Found Denim file: ${denimFile}`)
    console.log(`📸 Found Shorts file: ${shortsFile}`)

    // 2. Upload Denim Asset
    console.log('\n📤 Uploading Selvedge Denim asset...')
    const denimBuffer = fs.readFileSync(path.join(BRAIN_DIR, denimFile))
    const denimAsset = await client.assets.upload('image', denimBuffer, { filename: denimFile })
    console.log(`✅ Denim Asset uploaded successfully! ID: ${denimAsset._id}`)

    // 3. Upload Shorts Asset
    console.log('\n📤 Uploading Linen Shorts asset...')
    const shortsBuffer = fs.readFileSync(path.join(BRAIN_DIR, shortsFile))
    const shortsAsset = await client.assets.upload('image', shortsBuffer, { filename: shortsFile })
    console.log(`✅ Shorts Asset uploaded successfully! ID: ${shortsAsset._id}`)

    // Helper to generate key
    const genKey = () => Math.random().toString(36).slice(2, 9)

    // 4. Link Selvedge Denim asset to "Vintage Wash Selvedge Denim"
    console.log('\n🔗 Linking denim asset to "Vintage Wash Selvedge Denim" (vintage-wash-selvedge-denim)...')
    const denimProduct = await client.fetch(`*[_type == "product" && slug.current == "vintage-wash-selvedge-denim"][0]`)
    if (denimProduct && denimProduct.variants) {
        const updatedVariants = denimProduct.variants.map((v: any) => {
            // Keep the first 2 images, append our premium newly generated model shot as the 3rd!
            const baseImages = (v.images || []).slice(0, 2)
            baseImages.push({
                _type: 'image',
                _key: genKey(),
                asset: { _type: 'reference', _ref: denimAsset._id }
            })
            return { ...v, images: baseImages }
        })
        await client.patch(denimProduct._id).set({ variants: updatedVariants }).commit()
        console.log('✅ Successfully updated Denim product variants with the premium model shot!')
    } else {
        console.warn('⚠️ Denim product not found in database!')
    }

    // 5. Link Linen Shorts asset to "The Riviera Linen Short"
    console.log('\n🔗 Linking shorts asset to "The Riviera Linen Short" (the-riviera-linen-short)...')
    const shortsProduct = await client.fetch(`*[_type == "product" && slug.current == "the-riviera-linen-short"][0]`)
    if (shortsProduct && shortsProduct.variants) {
        const updatedVariants = shortsProduct.variants.map((v: any) => {
            const baseImages = (v.images || []).slice(0, 2)
            baseImages.push({
                _type: 'image',
                _key: genKey(),
                asset: { _type: 'reference', _ref: shortsAsset._id }
            })
            return { ...v, images: baseImages }
        })
        await client.patch(shortsProduct._id).set({ variants: updatedVariants }).commit()
        console.log('✅ Successfully updated "The Riviera Linen Short" variants with the premium model shot!')
    } else {
        console.warn('⚠️ Riviera shorts product not found!')
    }

    // 6. Link Linen Shorts asset to "The Urban Explorer Edit" as well
    console.log('\n🔗 Linking shorts asset to "The Urban Explorer Edit" (the-urban-explorer-edit)...')
    const explorerProduct = await client.fetch(`*[_type == "product" && slug.current == "the-urban-explorer-edit"][0]`)
    if (explorerProduct && explorerProduct.variants) {
        const updatedVariants = explorerProduct.variants.map((v: any) => {
            const baseImages = (v.images || []).slice(0, 2)
            baseImages.push({
                _type: 'image',
                _key: genKey(),
                asset: { _type: 'reference', _ref: shortsAsset._id }
            })
            return { ...v, images: baseImages }
        })
        await client.patch(explorerProduct._id).set({ variants: updatedVariants }).commit()
        console.log('✅ Successfully updated "The Urban Explorer Edit" with the premium model shot!')
    } else {
        console.warn('⚠️ Urban Explorer product not found!')
    }

    console.log('\n🎉 Finished uploading and linking premium custom assets!')
}

main().catch(console.error)
