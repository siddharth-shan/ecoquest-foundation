// Share images (Open Graph) for link previews.
//
// A page-level `openGraph` object replaces the root one wholesale, so every
// page that sets its own title has to name its own image too — otherwise the
// link preview has no picture at all.
//
// The files are 1200×630 JPEGs in public/og/, built by
// `node scripts/og/generate.mjs`. Add a card there before using a new slug here.

export function ogImage(slug: string, alt: string) {
  return [{ url: `/og/${slug}.jpg`, width: 1200, height: 630, alt }]
}
