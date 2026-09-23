"""Re-encode downloaded photos as progressive JPEGs (quality 80) to cut page weight.

    python scripts/optimize-images.py        # needs Pillow: pip install pillow

Safe to re-run: a file is only replaced when the new version is smaller.
"""
import io
import pathlib

from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
before = after = 0
for f in sorted(root.rglob("*.jpg")):
    data = f.read_bytes()
    before += len(data)
    img = Image.open(io.BytesIO(data)).convert("RGB")
    out = io.BytesIO()
    img.save(out, "JPEG", quality=80 if not f.stem.endswith("-t") else 75, progressive=True, optimize=True)
    if out.tell() < len(data):
        f.write_bytes(out.getvalue())
        after += out.tell()
    else:
        after += len(data)
print(f"{before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")
