#!/usr/bin/env python3
"""Generates web-sized event photos from the archived originals.

Why this exists: the site is a static export (`output: 'export'` with
`images.unoptimized`), so next/image emits a plain <img> — no srcset, no
resizing, and the `sizes` prop is inert. Whatever sits in public/ is exactly
what the browser downloads. Straight-off-the-phone photos run 3-5 MB each, and
the gallery's thumbnail strip requested all sixteen originals at once to render
them as 100px squares.

So the resizing happens here, ahead of the build:

  photo-originals/events/<name>            pristine, never deployed
  public/images/events/<stem>.webp         max 1600px  — page images and stage
  public/images/events/thumbs/<stem>.webp  320x320     — carousel strip

Originals go through sips first (which applies any EXIF rotation and gives
cwebp a clean RGB source), then cwebp, whose encoder is far more efficient than
the one sips ships with. Never writes a derivative larger than its source.

Re-run after adding a photo to photo-originals/events/:

  python3 scripts/optimize-photos.py

Needs sips (ships with macOS) and cwebp (`brew install webp`).
"""
import pathlib, shutil, subprocess, sys, tempfile

SRC = pathlib.Path('photo-originals/events')
WEB = pathlib.Path('public/images/events')
THUMBS = WEB / 'thumbs'

MAX_EDGE = 1600   # the stage renders at most ~1200 CSS px; 1600 covers retina
THUMB = 320       # the strip renders at ~100 CSS px; 320 covers 3x DPR
QUALITY = 78      # webp; visually clean on photographic content
THUMB_QUALITY = 75


def run(*args):
    subprocess.run([str(a) for a in args], check=True, capture_output=True)


def dimensions(path):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(path)],
                         check=True, capture_output=True, text=True).stdout
    vals = {k.strip(): int(v) for k, v in
            (l.split(':') for l in out.splitlines() if ':' in l and l.startswith(' '))}
    return vals['pixelWidth'], vals['pixelHeight']


def main():
    if not SRC.is_dir():
        sys.exit(f'No originals at {SRC}/ — nothing to do.')
    if not shutil.which('cwebp'):
        sys.exit('cwebp not found. Install it with:  brew install webp')
    THUMBS.mkdir(parents=True, exist_ok=True)

    before = after = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        for src in sorted(p for p in SRC.iterdir()
                          if p.suffix.lower() in {'.jpg', '.jpeg', '.png'}):
            before += src.stat().st_size
            w, h = dimensions(src)

            # Full size: only downscale, never up.
            staged = tmp / 'staged.jpg'
            args = ['sips', src, '-s', 'format', 'jpeg', '-s', 'formatOptions', 95,
                    '--out', staged]
            if max(w, h) > MAX_EDGE:
                args[2:2] = ['--resampleHeightWidthMax', MAX_EDGE]
            run(*args)
            web = WEB / f'{src.stem}.webp'
            run('cwebp', '-quiet', '-q', QUALITY, '-m', 5, staged, '-o', web)

            # Thumbnail: scale the SHORT edge to 320, then centre-crop square.
            scale = THUMB / min(w, h)
            cropped = tmp / 'cropped.jpg'
            run('sips', src, '-z', round(h * scale), round(w * scale),
                '-s', 'format', 'jpeg', '-s', 'formatOptions', 95, '--out', cropped)
            run('sips', cropped, '-c', THUMB, THUMB)
            thumb = THUMBS / f'{src.stem}.webp'
            run('cwebp', '-quiet', '-q', THUMB_QUALITY, '-m', 5, cropped, '-o', thumb)

            after += web.stat().st_size + thumb.stat().st_size
            print(f'  {src.name:46} {src.stat().st_size/1024:7.0f} KB  ->'
                  f' {web.stat().st_size/1024:6.0f} KB + {thumb.stat().st_size/1024:4.0f} KB thumb')

    print(f'\n{before/1024/1024:.1f} MB of originals -> {after/1024/1024:.1f} MB served'
          f'  ({100 - after/before*100:.0f}% smaller)')
    print(f'Thumbnail strip alone: {sum(p.stat().st_size for p in THUMBS.iterdir())/1024:.0f} KB '
          f'for all {len(list(THUMBS.iterdir()))} photos.')


if __name__ == '__main__':
    main()
