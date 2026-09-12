#!/usr/bin/env python3
"""Prints the speaker notes for a seminar deck.

The notes are not published. They live in src/data/decks.ts alongside the
slides, and /seminars/<slug>/ strips them before rendering, so there is no page
to read them from during a session. This prints them instead.

    python3 scripts/print-speaker-notes.py                  # list the decks
    python3 scripts/print-speaker-notes.py wildfire-data    # one deck
    python3 scripts/print-speaker-notes.py wildfire-data > notes.md

Written against decks.ts as a text file rather than by importing it, so it needs
no TypeScript toolchain and runs on a laptop two minutes before a session.
"""
import pathlib
import re
import sys

DECKS = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'data' / 'decks.ts'


def unquote(raw: str) -> str:
    """Collapses a TS single-quoted string, including multi-line continuations."""
    return re.sub(r"\s*\n\s*", ' ', raw).replace("\\'", "'").strip()


def parse(source: str) -> dict[str, list[dict[str, str]]]:
    """Pulls {slug: [{title, notes}, ...]} out of the deck source."""
    decks: dict[str, list[dict[str, str]]] = {}
    slug = None
    slide: dict[str, str] = {}

    for match in re.finditer(
        r"^  '([\w-]+)': \[|^\s*(title|notes):\s*((?:'(?:[^'\\]|\\.|\n)*')|(?:\n\s*'(?:[^'\\]|\\.|\n)*'))",
        source,
        re.MULTILINE,
    ):
        if match.group(1):
            # Flush the deck's last slide before starting the next deck —
            # slides are only appended when the *following* title appears.
            if slide and slug:
                decks[slug].append(slide)
            slug = match.group(1)
            decks[slug] = []
            slide = {}
            continue
        key, raw = match.group(2), match.group(3).strip()
        if key == 'title':
            if slide and slug:
                decks[slug].append(slide)
            slide = {'title': unquote(raw[1:-1])}
        elif slug is not None:
            slide['notes'] = unquote(raw[1:-1])

    if slide and slug:
        decks[slug].append(slide)
    return decks


def main() -> int:
    decks = parse(DECKS.read_text())

    if len(sys.argv) < 2:
        print('Decks:\n')
        for slug, slides in decks.items():
            noted = sum(1 for s in slides if s.get('notes'))
            print(f'  {slug:<22} {len(slides)} slides, {noted} with notes')
        print(f'\nUsage: python3 {sys.argv[0]} <slug>')
        return 0

    slug = sys.argv[1]
    if slug not in decks:
        print(f'No deck named "{slug}". Run with no arguments to list them.', file=sys.stderr)
        return 1

    print(f'# Speaker notes — {slug}\n')
    print('Not published. Do not paste these onto the site.\n')
    for i, slide in enumerate(decks[slug], 1):
        print(f'## {i}. {slide["title"]}\n')
        print(f'{slide.get("notes", "_No notes for this slide._")}\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
