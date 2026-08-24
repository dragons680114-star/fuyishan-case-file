"""Convert presentation PNG assets to smaller WebP files for static deployment."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIRS = (
    ROOT / "assets" / "background",
    ROOT / "geo-ai" / "assets" / "images",
    ROOT / "precision-worktime" / "assets" / "images",
)


def main() -> None:
    converted = 0
    before = 0
    after = 0

    for asset_dir in ASSET_DIRS:
        for source in sorted(asset_dir.glob("*.png")):
            target = source.with_suffix(".webp")
            with Image.open(source) as image:
                image = image.convert("RGB")
                image.save(target, "WEBP", quality=82, method=6)
            converted += 1
            before += source.stat().st_size
            after += target.stat().st_size
            print(f"{source.relative_to(ROOT)}: {source.stat().st_size:,} -> {target.stat().st_size:,}")

    print(f"Converted {converted} files")
    print(f"Total: {before:,} -> {after:,} bytes")


if __name__ == "__main__":
    main()
