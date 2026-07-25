import os
import glob
from PIL import Image, ImageOps, ImageChops

MOBILES_DIR = '/Users/amansharma/Downloads/mobiles'
OUTPUT_DIR = '/Users/amansharma/Downloads/mobiles_optimized'

TARGET_WIDTH = 1200
TARGET_HEIGHT = 1600
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT # 0.75 (3:4)

def get_corner_color(img):
    # Sample 4 corners
    w, h = img.size
    corners = [
        img.getpixel((2, 2)),
        img.getpixel((w - 3, 2)),
        img.getpixel((2, h - 3)),
        img.getpixel((w - 3, h - 3))
    ]
    # If RGBA, return tuple of 3 or 4
    return corners[0]

def optimize_image(src_path, dst_path):
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    try:
        with Image.open(src_path) as orig_img:
            # Convert to RGBA for processing
            img = orig_img.convert('RGBA')
            w, h = img.size

            # If image is RGBA with alpha channel
            alpha = img.getchannel('A')
            bbox = alpha.getbbox()

            # If no alpha transparency or full opacity, detect background color difference
            if not bbox or bbox == (0, 0, w, h):
                # Detect background color from corners
                bg_color = get_corner_color(img)
                bg_img = Image.new('RGBA', (w, h), bg_color)
                diff = ImageChops.difference(img, bg_img)
                diff_gray = diff.convert('L')
                # Threshold difference to ignore subtle compression noise
                threshold = 12
                mask = diff_gray.point(lambda p: 255 if p > threshold else 0)
                bbox = mask.getbbox()

            if not bbox:
                bbox = (0, 0, w, h)

            # Crop product bounding box
            left, upper, right, lower = bbox
            crop_w = right - left
            crop_h = lower - upper

            # Avoid extreme tight crops if bounding box is almost full
            if crop_w < 10 or crop_h < 10:
                left, upper, right, lower = 0, 0, w, h
                crop_w, crop_h = w, h

            cropped_product = img.crop((left, upper, right, lower))

            # Determine background fill color for canvas
            bg_corner = get_corner_color(img)
            # If corner is near white or transparent, use solid white (255, 255, 255, 255)
            if isinstance(bg_corner, tuple) and len(bg_corner) >= 3:
                r, g, b = bg_corner[:3]
                if r > 240 and g > 240 and b > 240:
                    canvas_bg = (255, 255, 255, 255)
                elif len(bg_corner) == 4 and bg_corner[3] < 10:
                    canvas_bg = (255, 255, 255, 255)
                else:
                    canvas_bg = (r, g, b, 255)
            else:
                canvas_bg = (255, 255, 255, 255)

            # Create target canvas 1200x1600 (3:4 ratio)
            canvas = Image.new('RGBA', (TARGET_WIDTH, TARGET_HEIGHT), canvas_bg)

            # Calculate scale to fit product in 82% of canvas height / width
            max_p_w = int(TARGET_WIDTH * 0.84)
            max_p_h = int(TARGET_HEIGHT * 0.84)

            scale_w = max_p_w / crop_w
            scale_h = max_p_h / crop_h
            scale = min(scale_w, scale_h)

            new_w = max(1, int(crop_w * scale))
            new_h = max(1, int(crop_h * scale))

            resized_product = cropped_product.resize((new_w, new_h), Image.Resampling.LANCZOS)

            # Center on canvas
            paste_x = (TARGET_WIDTH - new_w) // 2
            paste_y = (TARGET_HEIGHT - new_h) // 2

            canvas.paste(resized_product, (paste_x, paste_y), resized_product)

            # Convert to WebP or JPEG/PNG depending on extension
            ext = os.path.splitext(dst_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                final_img = canvas.convert('RGB')
                final_img.save(dst_path, 'JPEG', quality=92, optimize=True)
            elif ext == '.webp':
                canvas.save(dst_path, 'WEBP', quality=92, method=6)
            else:
                canvas.save(dst_path, 'PNG', optimize=True)

            return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

def main():
    print("🎨 Starting Product Image Aspect Ratio & Canvas Optimization...")
    count = 0
    success = 0
    for root, dirs, files in os.walk(MOBILES_DIR):
        for file in files:
            if file.startswith('.'):
                continue
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                count += 1
                src = os.path.join(root, file)
                rel = os.path.relpath(src, MOBILES_DIR)
                dst = os.path.join(OUTPUT_DIR, rel)
                if optimize_image(src, dst):
                    success += 1

    print(f"🎉 Optimization Complete! Processed {success}/{count} images saved to {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
