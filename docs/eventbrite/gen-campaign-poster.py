#!/usr/bin/env python3
"""Renders the October Environmental Action Campaign poster and cover banner.

Two outputs, same facts:
  october-campaign-poster.png  1200x1700  portrait flyer -- printed, and shown
                                          on /events/
  october-campaign-banner.png  2160x1080  Eventbrite / social cover

Every fact printed here is read from src/data/campaigns.ts below, so the image
and the website cannot drift apart. That matters more than it sounds: text on
the site greps clean when a detail changes, while a stale claim survives inside
a PNG forever. If a date, a venue, or a form URL changes, re-run this script.

No photographs of people, and no AI-generated imagery -- the art is CSS.

The poster is also copied into public/images/campaigns/ -- as a PNG people can
print, and as a WebP the page actually serves -- so re-running this script is
all it takes to update the flyer shown on /events/.

Requires segno for the QR codes and Pillow for the WebP:
    python3 -m venv .venv && .venv/bin/pip install segno pillow
    .venv/bin/python docs/eventbrite/gen-campaign-poster.py
"""
import pathlib
import re
import subprocess

import segno
from PIL import Image

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
CAMPAIGNS_TS = REPO / "src" / "data" / "campaigns.ts"
PUBLIC = REPO / "public" / "images" / "campaigns"

CONTACT = "ecoquestfoundation.org/contact"


def field(block: str, name: str) -> str:
    """Pulls a single-quoted string field out of a campaigns.ts entry."""
    m = re.search(rf"\b{name}:\s*\n?\s*'((?:[^'\\]|\\.)*)'", block)
    if not m:
        raise SystemExit(f"campaigns.ts: could not read {name!r}")
    return m.group(1).replace("\\'", "'")


def optional_field(block: str, name: str) -> str:
    """Same as field(), but returns '' for a field the entry may omit."""
    m = re.search(rf"\b{name}:\s*\n?\s*'((?:[^'\\]|\\.)*)'", block)
    return m.group(1).replace("\\'", "'") if m else ""


def load_campaigns() -> dict:
    """Reads the two campaign entries out of the TypeScript source.

    Deliberately parsed rather than retyped. A poster that quotes the data file
    is a poster that cannot quietly disagree with the website.
    """
    src = CAMPAIGNS_TS.read_text()
    blocks = {}
    for block in re.split(r"\n  \{\n", src.split("export const campaigns")[1])[1:]:
        slug = field(block, "slug")
        blocks[slug] = {
            "title": field(block, "title"),
            "displayDate": field(block, "displayDate"),
            "displayTime": field(block, "displayTime"),
            "serviceHours": field(block, "serviceHours"),
            "registrationUrl": field(block, "registrationUrl"),
            "supportedBy": optional_field(block, "supportedBy"),
            "block": block,
        }
    return blocks


def qr_uri(url: str, scale: int = 9) -> str:
    return segno.make(url, error="m").png_data_uri(
        scale=scale, border=2, dark="#0f2a1a", light="#ffffff"
    )


C = load_campaigns()
CH = C["biodiversity-challenge-2026"]
CL = C["friendship-park-cleanup-2026"]

# Venue is structured in the data file; rebuild the one-line form for print.
street = field(CL["block"], "street")
city = field(CL["block"], "city")
region = field(CL["block"], "region")
postal = field(CL["block"], "postalCode")
VENUE = field(CL["block"], "name")
VENUE_ADDR = f"{street}, {city}, {region} {postal}"

# EcoQuest organizes and runs these events; any group named here supplies
# volunteers. Kept as one credit line so the printed flyer and the /events/ card
# attribute the event the same way — see the supportedBy note in campaigns.ts.
CREDIT = "Organized by EcoQuest Foundation"
if CL["supportedBy"]:
    CREDIT += f", {CL['supportedBy']}"

BASE = """
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Avenir Next','Helvetica Neue',Helvetica,Arial,sans-serif;
  overflow:hidden;background:#0f2a1a}
.brandrow{display:flex;align-items:center;gap:22px}
.brandrow img{width:92px;height:92px;border-radius:20px;background:#fff;padding:7px;
  box-shadow:0 8px 28px rgba(0,0,0,.22)}
.brandname{color:#fff;font-size:34px;font-weight:700;line-height:1.15}
.brandsub{color:rgba(255,255,255,.72);font-size:20px;font-weight:500;margin-top:5px}
.kicker{display:inline-block;background:#fbbc04;color:#1a1a1a;font-weight:800;
  letter-spacing:2.4px;text-transform:uppercase;border-radius:999px}
h1{color:#fff;font-weight:800;letter-spacing:-1.6px;line-height:1.05;
  text-shadow:0 3px 18px rgba(0,0,0,.18)}
.card{background:#fff;border-radius:24px;display:flex;flex-direction:column;
  box-shadow:0 26px 60px rgba(0,0,0,.34)}
.cardtop{display:flex;align-items:center;gap:14px}
.pill{font-size:19px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;
  padding:8px 16px;border-radius:999px;background:#e6f4ea;color:#137333}
.pill.amber{background:#fef7e0;color:#8a6100}
.ctitle{color:#12251a;font-weight:800;letter-spacing:-.8px;line-height:1.1}
.row{display:flex;align-items:flex-start;gap:12px;color:#33413a;line-height:1.4}
.row b{color:#12251a;font-weight:700}
.ico{color:#137333;font-weight:800;flex:0 0 auto}
.hours{background:#f3f8f4;border-left:5px solid #34a853;border-radius:10px;
  color:#204030;line-height:1.4}
.hours b{display:block;color:#137333;text-transform:uppercase;letter-spacing:1.4px}
.qrwrap{display:flex;align-items:center;gap:18px;margin-top:auto}
.qrwrap img{border-radius:12px;background:#fff;flex:0 0 auto}
.qrlabel{color:#5b6b63;line-height:1.35}
.qrlabel b{display:block;color:#12251a}
.foot{color:rgba(255,255,255,.9);font-weight:600;text-align:center}
.foot i{font-style:normal;color:#fbbc04}
"""

POSTER = f"""<!doctype html><meta charset="utf-8"><style>{BASE}
body{{width:1200px;height:1700px;padding:64px 60px 52px;
  display:flex;flex-direction:column;
  background:linear-gradient(160deg,#137333 0%,#1c8f42 52%,#34a853 100%);
  position:relative}}
body::after{{content:'';position:absolute;right:-220px;top:-200px;width:620px;height:620px;
  border-radius:50%;background:rgba(255,255,255,.07)}}
.kicker{{align-self:flex-start;font-size:20px;padding:11px 22px;margin:30px 0 16px}}
h1{{font-size:62px;max-width:17ch;margin-bottom:12px}}
.lede{{color:rgba(255,255,255,.88);font-size:24px;font-weight:500;line-height:1.45;
  max-width:32ch;margin-bottom:30px}}
.cards{{display:flex;flex-direction:column;gap:24px;position:relative;z-index:1}}
.card{{padding:28px 32px;gap:13px}}
.ctitle{{font-size:34px}}
.row{{font-size:22px}}
.hours{{padding:13px 17px;font-size:20px;margin-top:2px}}
.hours b{{font-size:14px;margin-bottom:3px}}
.qrwrap{{padding-top:12px}}
.qrwrap img{{width:132px;height:132px}}
.qrlabel{{font-size:19px}}
.foot{{margin-top:auto;padding-top:30px;font-size:24px;position:relative;z-index:1}}
</style>
<div class="brandrow">
  <img src="logo.png" alt="">
  <div><div class="brandname">EcoQuest Foundation</div>
  <div class="brandsub">501(c)(3) environmental nonprofit</div></div>
</div>

<div class="kicker">October 2026 &middot; Free &middot; All ages</div>
<h1>October Environmental Action Campaign</h1>
<p class="lede">Two ways to take part &mdash; one from anywhere in California,
one morning of hands-on work in Cerritos.</p>

<div class="cards">
  <div class="card">
    <div class="cardtop"><span class="pill">Online</span>
      <span class="pill amber">All month</span></div>
    <div class="ctitle">{CH['title']}</div>
    <div class="row"><span class="ico">&#9679;</span>
      <span><b>{CH['displayDate']}</b> &middot; {CH['displayTime']}</span></div>
    <div class="row"><span class="ico">&#9679;</span>
      <span>Anywhere in California &mdash; document species with iNaturalist</span></div>
    <div class="hours"><b>Service hours</b>{CH['serviceHours']}</div>
    <div class="qrwrap"><img src="{qr_uri(CH['registrationUrl'])}" alt="">
      <div class="qrlabel"><b>Scan to join</b>Or sign up at<br>{CONTACT}</div></div>
  </div>

  <div class="card">
    <div class="cardtop"><span class="pill">In person</span>
      <span class="pill amber">One morning</span></div>
    <div class="ctitle">{CL['title']}</div>
    <div class="row"><span class="ico">&#9679;</span>
      <span><b>{CL['displayDate']}</b> &middot; {CL['displayTime']}</span></div>
    <div class="row"><span class="ico">&#9679;</span>
      <span><b>{VENUE}</b><br>{VENUE_ADDR}</span></div>
    <div class="hours"><b>Service hours</b>{CL['serviceHours']} &middot;
      Bags, gloves, and grabbers provided</div>
    <div class="qrwrap"><img src="{qr_uri(CL['registrationUrl'])}" alt="">
      <div class="qrlabel"><b>Scan to volunteer</b>Or sign up at<br>{CONTACT}</div></div>
  </div>
</div>

<div class="foot">{CREDIT} &middot; Questions? <i>{CONTACT}</i></div>
"""

BANNER = f"""<!doctype html><meta charset="utf-8"><style>{BASE}
body{{width:2160px;height:1080px;display:flex}}
.left{{width:44%;padding:80px 64px 80px 88px;display:flex;flex-direction:column;
  justify-content:center;position:relative;overflow:hidden;
  background:linear-gradient(150deg,#137333 0%,#1c8f42 55%,#34a853 100%)}}
.left::after{{content:'';position:absolute;right:-180px;top:-180px;width:520px;height:520px;
  border-radius:50%;background:rgba(255,255,255,.06)}}
.brandrow{{margin-bottom:46px}}
.kicker{{align-self:flex-start;font-size:22px;padding:12px 24px;margin-bottom:30px}}
h1{{font-size:68px;max-width:14ch;margin-bottom:26px}}
.lede{{color:rgba(255,255,255,.86);font-size:27px;font-weight:500;line-height:1.5;max-width:26ch}}
.stamp{{margin-top:36px;color:#fff;font-size:24px;font-weight:600;
  border-top:2px solid rgba(255,255,255,.28);padding-top:24px}}
.right{{width:56%;padding:76px 80px;display:flex;flex-direction:column;
  justify-content:center;gap:26px;
  background:radial-gradient(circle at 40% 35%,#1d3c2a,#0f2a1a 78%)}}
.card{{padding:30px 34px;gap:12px}}
.ctitle{{font-size:35px}}
.row{{font-size:22px}}
.hours{{padding:12px 16px;font-size:20px}}
.hours b{{font-size:14px;margin-bottom:3px}}
.qrwrap{{padding-top:10px}}
.qrwrap img{{width:118px;height:118px}}
.qrlabel{{font-size:19px}}
</style>
<div class="left">
  <div class="brandrow"><img src="logo.png" alt="">
    <div><div class="brandname">EcoQuest Foundation</div>
    <div class="brandsub">501(c)(3) environmental nonprofit</div></div></div>
  <div class="kicker">October 2026 &middot; Free</div>
  <h1>October Environmental Action Campaign</h1>
  <p class="lede">Two ways to take part &mdash; one from anywhere in California,
  one morning of hands-on work in Cerritos.</p>
  <div class="stamp">Open to all ages &middot; {CONTACT}</div>
</div>
<div class="right">
  <div class="card">
    <div class="cardtop"><span class="pill">Online</span>
      <span class="pill amber">All month</span></div>
    <div class="ctitle">{CH['title']}</div>
    <div class="row"><span class="ico">&#9679;</span>
      <span><b>{CH['displayDate']}</b> &middot; Anywhere in California, with iNaturalist</span></div>
    <div class="hours"><b>Service hours</b>{CH['serviceHours']}</div>
    <div class="qrwrap"><img src="{qr_uri(CH['registrationUrl'], 7)}" alt="">
      <div class="qrlabel"><b>Scan to join</b>{CONTACT}</div></div>
  </div>
  <div class="card">
    <div class="cardtop"><span class="pill">In person</span>
      <span class="pill amber">One morning</span></div>
    <div class="ctitle">{CL['title']}</div>
    <div class="row"><span class="ico">&#9679;</span>
      <span><b>{CL['displayDate']}</b> &middot; {CL['displayTime']}<br>{VENUE}, {VENUE_ADDR}</span></div>
    <div class="hours"><b>Service hours</b>{CL['serviceHours']}</div>
    <div class="qrwrap"><img src="{qr_uri(CL['registrationUrl'], 7)}" alt="">
      <div class="qrlabel"><b>Scan to volunteer</b>{CONTACT}</div></div>
  </div>
</div>
"""

for name, html, size in (
    ("october-campaign-poster", POSTER, "1200,1700"),
    ("october-campaign-banner", BANNER, "2160,1080"),
):
    (HERE / f"{name}.html").write_text(html)
    subprocess.run(
        [
            CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1", f"--window-size={size}",
            "--allow-file-access-from-files",
            f"--screenshot={HERE / (name + '.png')}",
            f"file://{HERE / (name + '.html')}",
        ],
        check=True,
        capture_output=True,
    )
    print(f"rendered {name}.png  ({size.replace(',', 'x')})")

# Publish the poster to the site. The PNG is the printable download; the WebP is
# what the page serves, because a half-megabyte PNG above the fold is not worth
# it. Both come from this one render, so they cannot disagree.
PUBLIC.mkdir(parents=True, exist_ok=True)
poster = Image.open(HERE / "october-campaign-poster.png").convert("RGB")
poster.save(PUBLIC / "october-2026-poster.png")
poster.save(PUBLIC / "october-2026-poster.webp", quality=84, method=6)
for out in ("october-2026-poster.png", "october-2026-poster.webp"):
    kb = (PUBLIC / out).stat().st_size // 1024
    print(f"published public/images/campaigns/{out}  ({kb} KB)")
