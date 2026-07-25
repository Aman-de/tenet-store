import os
import glob
from PIL import Image, ImageChops
from concurrent.futures import ProcessPoolExecutor, as_completed

MOBILES_DIR = '/Users/amansharma/Downloads/mobiles'
OUTPUT_DIR = '/Users/amansharma/Downloads/mobiles_optimized'

TARGET_WIDTH = 1200
TARGET_HEIGHT = 1600

def get_corner_color(img):
    w, h = img.size
    corners = [
        img.getpixel((2, 2)),
        img.getpixel((w - 3, 2)),
        img.getpixel((2, h - 3)),
        img.getpixel((w - 3, h - 3))
    ]
    return corners[0]

def process_single_image(paths):
    src_path, dst_path = paths
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    try:
        with Image.open(src_path) as orig_img:
            img = orig_img.convert('RGBA')
            w, h = img.size

            # Alpha channel bounding box
            alpha = img.getchannel('A')
            bbox = alpha.getbbox()

            # Background color thresholding if no alpha
            if not bbox or bbox == (0, 0, w, h):
                bg_color = get_corner_color(img)
                bg_img = Image.new('RGBA', (w, h), bg_color)
                diff = ImageChops.difference(img, bg_img)
                diff_gray = diff.convert('L')
                mask = diff_gray.point(lambda p: 255 if p > 15 else 0)
                bbox = mask.getbbox()

            if not bbox:
                bbox = (0, 0, w, h)

            left, upper, right, lower = bbox
            crop_w = right - left
            crop_h = lower - upper

            if crop_w < 10 or crop_h < 10:
                left, upper, right, lower = 0, 0, w, h
                crop_w, crop_h = w, h

            cropped_product = img.crop((left, upper, right, lower))

            bg_corner = get_corner_color(img)
            if isinstance(bg_corner, tuple) and len(bg_corner) >= 3:
                r, g, b = bg_corner[:3]
                if r > 235 and g > 235 and b > 235:
                    canvas_bg = (255, 255, 255, 255)
                elif len(bg_corner) == 4 and bg_corner[3] < 10:
                    canvas_bg = (255, 255, 255, 255)
                else:
                    canvas_bg = (r, g, b, 255)
            else:
                canvas_bg = (255, 255, 255, 255)

            canvas = Image.new('RGBA', (TARGET_WIDTH, TARGET_HEIGHT), canvas_bg)

            max_p_w = int(TARGET_WIDTH * 0.84)
            max_p_h = int(TARGET_HEIGHT * 0.84)

            scale_w = max_p_w / crop_w
            scale_h = max_p_h / crop_h
            scale = min(scale_w, scale_h)

            new_w = max(1, int(crop_w * scale))
            new_h = max(1, int(crop_h * scale))

            resized_product = cropped_product.resize((new_w, new_h), Image.Resampling.BILINEAR)

            paste_x = (TARGET_WIDTH - new_w) // 2
            paste_y = (TARGET_HEIGHT - new_h) // 2

            canvas.paste(resized_product, (paste_x, paste_y), resized_product)

            ext = os.path.splitext(dst_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                final_img = canvas.convert('RGB')
                final_img.save(dst_path, 'JPEG', quality=90)
            elif ext == '.webp':
                canvas.save(dst_path, 'WEBP', quality=90)
            else:
                canvas.save(dst_path, 'PNG')

            return True
    except Exception as e:
        print(f"Error processing {src_path}: {e}")
        return False

def main():
    print("🚀 Running Fast Multi-Threaded Image Aspect Ratio Optimization...")
    tasks = []
    for root, dirs, files in os.walk(MOBILES_DIR):
        for file in files:
            if file.startswith('.'):
                continue
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                src = os.path.join(root, file)
                rel = os.path.relpath(src, MOBILES_DIR)
                dst = os.path.join(OUTPUT_DIR, rel)
                tasks.append((src, dst))

    print(f"Found {len(tasks)} images to process...")
    success = 0
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
        futures = [executor.submit(process_single_image, task) for task in tasks]
        for f in as_completed(futures):
            if f.result():
                success += 1

    print(f"🎉 Processed and saved {success}/{len(tasks)} images in 3:4 aspect ratio to {OUTPUT_DIR}!")

if __name__ == '__main__':
    main()
