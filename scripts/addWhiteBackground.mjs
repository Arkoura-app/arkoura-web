import sharp from 'sharp'
import { resolve } from 'path'

const sizes = [192, 512]

for (const size of sizes) {
  const input = resolve(`public/icon-${size}.png`)
  const tmp = resolve(`public/icon-${size}-new.png`)

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input, blend: 'over' }])
    .png()
    .toFile(tmp)

  console.log(`✅ Processed icon-${size}.png → icon-${size}-new.png`)
}
