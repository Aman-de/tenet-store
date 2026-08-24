import os
from PIL import Image

MOBILES_DIR = "/Users/amansharma/Downloads/mobiles"

def inspect_dir(path):
    print("=== INSPECTING:", path)
    for root, dirs, files in os.walk(path):
        rel = os.path.relpath(root, path)
        img_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
        if img_files:
            print(f"\n📁 Directory: {rel} ({len(img_files)} images)")
            # Sample first 3 images aspect ratio and alpha
            for f in img_files[:3]:
                fpath = os.path.join(root, f)
                try:
                    with Image.open(fpath) as img:
                        w, h = img.size
                        ratio = round(w / h, 2)
                        has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
                        print(f"   🖼️  {f}: {w}x{h} (Aspect Ratio: {ratio}, Alpha/Transparent: {has_alpha})")
                except Exception as e:
                    print(f"   ⚠️  {f}: {e}")

if __name__ == "__main__":
    inspect_dir(MOBILES_DIR)
