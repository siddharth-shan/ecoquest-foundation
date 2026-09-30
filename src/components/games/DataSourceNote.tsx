// Provenance line. Required on every game.
//
// These games make factual claims about a student's own town, on a site that has
// to be able to show where every number came from. If a panel cannot name its
// source, it should not be on the page.

interface Source {
  label: string
  href: string
}

interface DataSourceNoteProps {
  sources: Source[]
  /** Caveats about what the data is and is not — e.g. model vs. measurement. */
  note?: string
  /**
   * True when the figures shown are bundled sample data rather than a live
   * lookup for this player's location. Stated plainly; never glossed over.
   */
  isFixture?: boolean
  fixtureLabel?: string
}

export default function DataSourceNote({
  sources,
  note,
  isFixture = false,
  fixtureLabel,
}: DataSourceNoteProps) {
  return (
    <div className="mt-8 text-sm text-gray-600 border-t border-gray-200 pt-4">
      {isFixture && (
        <p className="mb-2 font-semibold text-accent-orange">
          {fixtureLabel ??
            'Showing sample data from Cerritos, CA — live data is unavailable right now.'}
        </p>
      )}
      <p>
        <span className="font-semibold text-gray-700">Data: </span>
        {sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && ', '}
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-blue underline hover:no-underline"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
      {note && <p className="mt-2 text-gray-500">{note}</p>}
    </div>
  )
}
