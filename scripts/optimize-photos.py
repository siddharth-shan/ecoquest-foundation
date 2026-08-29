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

# The Eventbrite cover art doubles as the card image for each session on the
# events page. Same source file, so the listing and the site cannot show
# different art for the same session.
BANNERS = pathlib.Path('docs/eventbrite')
BANNER_OUT = pathlib.Path('public/images/seminars')
BANNER_FOR_SLUG = {
    'wildfire-data': 'wildfire-banner.png',
    'beach-cleanup-data': 'beach-cleanup-banner.png',
    'home-footprint': 'home-footprint-banner.png',
    'climate-anxiety': 'climate-anxiety-banner.png',
    'local-conservation': 'local-conservation-banner.png',
}
BANNER_WIDTH = 900
BANNER_ART = (450, 380)   # right-hand art panel for the events-page cards: w, h

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

    build_banners()

    print(f'\n{before/1024/1024:.1f} MB of originals -> {after/1024/1024:.1f} MB served'
          f'  ({100 - after/before*100:.0f}% smaller)')
    print(f'Thumbnail strip alone: {sum(p.stat().st_size for p in THUMBS.iterdir())/1024:.0f} KB '
          f'for all {len(list(THUMBS.iterdir()))} photos.')


def build_banners():
    """Session cover art, 2160x1080, down to a card-sized 2:1 WebP."""
    BANNER_OUT.mkdir(parents=True, exist_ok=True)
    print()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        for slug, name in BANNER_FOR_SLUG.items():
            src = BANNERS / name
            if not src.exists():
                print(f'  ! {name} missing — skipping {slug}')
                continue
            staged = tmp / 'banner.jpg'
            run('sips', src, '--resampleWidth', BANNER_WIDTH,
                '-s', 'format', 'jpeg', '-s', 'formatOptions', 95, '--out', staged)
            out = BANNER_OUT / f'{slug}.webp'
            run('cwebp', '-quiet', '-q', QUALITY, '-m', 5, staged, '-o', out)

            # The banners put the title on the left panel and the artwork on the
            # right, with a caption strip along the bottom. A centre crop would
            # slice the title in half and the card column clips the caption
            # mid-word, so the thumbnail takes the right-hand art panel only —
            # above the caption band, no cut text at any width.
            aw, ah = BANNER_ART
            sq = tmp / 'square.jpg'
            shutil.copy(staged, sq)
            run('sips', sq, '-c', ah, aw, '--cropOffset', 0, BANNER_WIDTH - aw)
            out_sq = BANNER_OUT / f'{slug}-square.webp'
            run('cwebp', '-quiet', '-q', QUALITY, '-m', 5, sq, '-o', out_sq)
            print(f'  {name:34} -> {slug}.webp {out.stat().st_size/1024:4.0f} KB'
                  f' + {slug}-square.webp {out_sq.stat().st_size/1024:4.0f} KB')


if __name__ == '__main__':
    main()
