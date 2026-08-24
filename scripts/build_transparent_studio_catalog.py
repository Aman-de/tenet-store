import os
import sys
import glob
from PIL import Image, ImageOps
import numpy as np
from concurrent.futures import ProcessPoolExecutor, as_completed

SRC_DIR = "/Users/amansharma/Downloads/mobiles"
DEST_DIR = "/Users/amansharma/Downloads/mobiles_transparent"

TARGET_W = 1200
TARGET_H = 1600
SCALE_FACTOR = 0.82

def make_white_transparent(img_rgba, tolerance=15):
    """
    Converts near-white background pixels (R,G,B >= 240) to transparent.
    """
    arr = np.array(img_rgba)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    white_mask = (r >= (255 - tolerance)) & (g >= (255 - tolerance)) & (b >= (255 - tolerance))
    arr[:, :, 3][white_mask] = 0
    return Image.fromarray(arr)

def process_product_image(file_path, rel_path):
    dest_path = os.path.join(DEST_DIR, rel_path)
    # Ensure dest extension is .png for transparency
    base, _ = os.path.splitext(dest_path)
    dest_png = base + ".png"
    
    os.makedirs(os.path.dirname(dest_png), exist_ok=True)

    try:
        with Image.open(file_path) as img:
            img_rgba = img.convert('RGBA')

            # Check if background is near white and convert to transparent
            img_rgba = make_white_transparent(img_rgba)

            # Get bounding box of non-transparent pixels
            bbox = img_rgba.getbbox()
            if not bbox:
                # Fallback if image is completely transparent
                img.save(dest_png, format="PNG")
                return dest_png

            cropped = img_rgba.crop(bbox)
            crop_w, crop_h = cropped.size

            # Compute target bounding size inside 1200x1600 at SCALE_FACTOR
            max_w = int(TARGET_W * SCALE_FACTOR)
            max_h = int(TARGET_H * SCALE_FACTOR)

            scale = min(max_w / crop_w, max_h / crop_h)
            new_w = max(1, int(crop_w * scale))
            new_h = max(1, int(crop_h * scale))

            resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

            # Create transparent 1200x1600 canvas
            canvas = Image.new('RGBA', (TARGET_W, TARGET_H), (0, 0, 0, 0))
            offset_x = (TARGET_W - new_w) // 2
            offset_y = (TARGET_H - new_h) // 2

            canvas.paste(resized, (offset_x, offset_y), resized)
            canvas.save(dest_png, format="PNG", optimize=True)
            return dest_png
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def process_banner_image(file_path, rel_path):
    """
    For landscape feature/description banners, preserve resolution/aspect ratio and save as optimized PNG/WebP.
    """
    dest_path = os.path.join(DEST_DIR, rel_path)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    try:
        with Image.open(file_path) as img:
            img.save(dest_path, optimize=True)
            return dest_path
    except Exception as e:
        print(f"Error processing banner {file_path}: {e}")
        return None

def main():
    print("🚀 Starting Transparent Studio Image Processor...")
    all_files = []
    for root, dirs, files in os.walk(SRC_DIR):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not f.startswith('.'):
                full_p = os.path.join(root, f)
                rel_p = os.path.relpath(full_p, SRC_DIR)
                all_files.append((full_p, rel_p))

    print(f"Found {len(all_files)} total images to process into transparent studio format.")

    product_tasks = []
    banner_tasks = []

    for full_p, rel_p in all_files:
        if "Colors" in rel_p or "hero" in rel_p.lower() or "product_gallery" in rel_p.lower():
            product_tasks.append((full_p, rel_p))
        else:
            banner_tasks.append((full_p, rel_p))

    processed_count = 0
    with ProcessPoolExecutor() as executor:
        futures = []
        for full_p, rel_p in product_tasks:
            futures.append(executor.submit(process_product_image, full_p, rel_p))
        for full_p, rel_p in banner_tasks:
            futures.append(executor.submit(process_banner_image, full_p, rel_p))

        for future in as_completed(futures):
            res = future.result()
            if res:
                processed_count += 1

    print(f"🎉 Successfully created {processed_count} transparent studio assets in {DEST_DIR}!")

if __name__ == "__main__":
    main()
