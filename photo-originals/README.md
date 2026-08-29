# Photo originals

Full-resolution originals, kept out of `public/` so they are never deployed.

The site is a static export (`output: 'export'` with `images.unoptimized`), so
`next/image` renders a plain `<img>`: no `srcset`, no resizing, and the `sizes`
prop has no effect. Whatever sits in `public/` is exactly what a browser
downloads. These files are 3–5 MB each straight off a phone, and the events
page gallery was pulling sixteen of them at full resolution to draw a row of
100-pixel thumbnails — about 31 MB before anything appeared.

So the derivatives are generated ahead of the build:

```bash
python3 scripts/optimize-photos.py
```

| | |
|---|---|
| `photo-originals/events/<name>` | pristine, archival, never deployed |
| `public/images/events/<stem>.webp` | max 1600px — page images and the carousel stage |
| `public/images/events/thumbs/<stem>.webp` | 320×320 centre crop — the carousel strip |

**To add a photo:** drop the original in `events/`, re-run the script, then
reference it as `/images/events/<stem>.webp`. Do not put a raw camera file in
`public/` — nothing will resize it.

Originals are kept because they are the record of the events themselves. A
1600px re-encode is fine for the website and is not what you want to hand
someone asking for documentation.
