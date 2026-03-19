import { config } from 'dotenv'
config({ path: '.env.local' })

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

async function generate() {
  try {
    const { default: sitemap } = await import('../app/sitemap.js')
    const routes = await sitemap()
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r: any) => `  <url>
    <loc>${r.url}</loc>
    ${r.lastModified ? `<lastmod>${new Date(r.lastModified).toISOString()}</lastmod>` : ''}
    ${r.changeFrequency ? `<changefreq>${r.changeFrequency}</changefreq>` : ''}
    ${r.priority !== undefined ? `<priority>${r.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

    const destDir = path.join(os.homedir(), 'Downloads')
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
        
    const dest = path.join(destDir, 'sitemap.xml')
    fs.writeFileSync(dest, xml)
    console.log(`Successfully wrote sitemap to ${dest}`)
  } catch (error) {
    console.error('Failed to write sitemap:', error)
  }
}

generate()
