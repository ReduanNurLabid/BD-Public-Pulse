"""Optimize the two Welcome Page showcase exports for the collage mockup.

The source files are full-resolution user downloads (5.9 MB PNG / 936 KB JPG).
The collage renders them at ~300 px (story card) and ~520 px (certificate)
wide, so 2x assets of 720 px and 1200 px are ample and keep the hero light.
"""

import os
from PIL import Image

OUT_DIR = os.path.join('src', 'assets', 'showcase')

SOURCES = [
    # (source, output name, target width, quality)
    (
        os.path.join('..', 'BD_Compass_A._K._Fazlul_Huq.png'),
        'personality-card-fazlul-huq.webp',
        720,
        80,
    ),
    (
        os.path.join('src', 'assets', 'BD_Political_Compass_2026_Sushil.jpg'),
        'certificate-2026.webp',
        1200,
        82,
    ),
]

os.makedirs(OUT_DIR, exist_ok=True)

for src, out_name, target_w, quality in SOURCES:
    if not os.path.exists(src):
        print(f'SKIP (missing source): {src}')
        continue

    img = Image.open(src)
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')

    if img.width > target_w:
        target_h = round(img.height * target_w / img.width)
        img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    out_path = os.path.join(OUT_DIR, out_name)
    img.save(out_path, 'WEBP', quality=quality, method=6)

    kb = os.path.getsize(out_path) / 1024
    print(f'{out_path}: {img.width}x{img.height} {kb:.1f} KB (from {src})')