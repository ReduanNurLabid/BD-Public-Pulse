import base64
import re
from PIL import Image
import io

# 1. Read SVG and extract embedded image
with open('src/assets/light mode logo.svg', 'r', encoding='utf-8') as f:
    svg_content = f.read()

# Copy to public/favicon.svg directly
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Saved public/favicon.svg")

# Extract base64
match = re.search(r'data:image/png;base64,([^"]+)', svg_content)
if match:
    b64_data = match.group(1)
    img_data = base64.b64decode(b64_data)
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    
    # Crop transparent borders if any
    bbox = img.getbbox()
    if bbox:
        # keep it square
        width = bbox[2] - bbox[0]
        height = bbox[3] - bbox[1]
        max_dim = max(width, height)
        # make square canvas
        cx = (bbox[0] + bbox[2]) // 2
        cy = (bbox[1] + bbox[3]) // 2
        half = max_dim // 2
        # Crop with margin
        margin = int(max_dim * 0.04) # 4% margin
        crop_box = (
            max(0, cx - half - margin),
            max(0, cy - half - margin),
            min(img.width, cx + half + margin),
            min(img.height, cy + half + margin)
        )
        cropped = img.crop(crop_box)
    else:
        cropped = img

    # Resize and save
    f16 = cropped.resize((16, 16), Image.Resampling.LANCZOS)
    f16.save('public/favicon-16x16.png')
    
    f32 = cropped.resize((32, 32), Image.Resampling.LANCZOS)
    f32.save('public/favicon-32x32.png')

    f48 = cropped.resize((48, 48), Image.Resampling.LANCZOS)
    f180 = cropped.resize((180, 180), Image.Resampling.LANCZOS)
    f180.save('public/apple-touch-icon.png')

    # Save multi-size ico
    cropped.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved all favicons (ico, png 16, 32, 180)")
else:
    print("No embedded image found")
