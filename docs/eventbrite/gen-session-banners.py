#!/usr/bin/env python3
"""Renders one Eventbrite cover per seminar session (2160x1080).

Right-hand art is either a real EcoQuest app screenshot or a CSS motif. No
photos of people, and no screenshot is paired with a session unless the app
genuinely relates to it -- the caption states what the app is, never what the
session will cover.
"""
import pathlib, subprocess

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{width:2160px;height:1080px;overflow:hidden;
  font-family:'Avenir Next','Helvetica Neue',Helvetica,Arial,sans-serif;
  display:flex;background:#0f2a1a}
.left{width:47%;padding:88px 72px 88px 96px;display:flex;flex-direction:column;
  justify-content:center;
  background:linear-gradient(150deg,#137333 0%,#1c8f42 55%,#34a853 100%);
  position:relative;overflow:hidden}
.left::after{content:'';position:absolute;right:-180px;top:-180px;
  width:520px;height:520px;border-radius:50%;background:rgba(255,255,255,.06)}
.brandrow{display:flex;align-items:center;gap:26px;margin-bottom:52px}
.brandrow img{width:104px;height:104px;border-radius:22px;background:#fff;
  padding:8px;box-shadow:0 8px 28px rgba(0,0,0,.22)}
.brandname{color:#fff;font-size:38px;font-weight:700;line-height:1.15}
.brandsub{color:rgba(255,255,255,.72);font-size:22px;font-weight:500;margin-top:6px}
.kicker{display:inline-block;align-self:flex-start;background:#fbbc04;color:#1a1a1a;
  font-size:23px;font-weight:800;letter-spacing:2.4px;text-transform:uppercase;
  padding:13px 26px;border-radius:999px;margin-bottom:34px}
h1{color:#fff;max-width:15ch;font-size:78px;line-height:1.05;font-weight:800;letter-spacing:-1.6px;
  margin-bottom:34px;text-shadow:0 3px 18px rgba(0,0,0,.18)}
.meta{color:#fff;font-size:34px;font-weight:600;line-height:1.55}
.meta span{color:rgba(255,255,255,.78);font-weight:500}
.free{margin-top:38px;color:#fff;font-size:27px;font-weight:600;
  border-top:2px solid rgba(255,255,255,.28);padding-top:26px}
.right{width:53%;position:relative;display:flex;align-items:center;
  justify-content:center;background:radial-gradient(circle at 40% 35%,#1d3c2a,#0f2a1a 78%)}
.frame{width:960px;border-radius:20px;overflow:hidden;
  box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.09);
  transform:rotate(-1.6deg)}
.frame.two{width:760px;position:absolute;top:150px;left:120px;z-index:2}
.frame.two.back{top:330px;left:430px;z-index:1;transform:rotate(2deg);opacity:.92}
.bar{height:44px;background:#e9edf0;display:flex;align-items:center;gap:9px;padding:0 18px}
.dot{width:12px;height:12px;border-radius:50%}
.shot{overflow:hidden;background:#fff}
.shot img{width:100%;display:block}
.tag{position:absolute;bottom:56px;right:70px;color:rgba(255,255,255,.82);
  font-size:24px;font-weight:600;letter-spacing:.4px;text-align:right;line-height:1.4}
/* motif */
.motif{display:flex;flex-direction:column;align-items:center;gap:56px}
.waves{display:flex;flex-direction:column;gap:26px}
.waves i{display:block;height:16px;border-radius:99px;background:rgba(52,168,83,.55)}
.tally{display:flex;gap:34px;align-items:flex-end}
.tally i{display:block;width:52px;border-radius:12px 12px 4px 4px;
  background:linear-gradient(180deg,#34a853,#137333)}
.pins{display:grid;grid-template-columns:repeat(4,1fr);gap:58px}
.pin{width:96px;height:96px;border-radius:50% 50% 50% 8px;transform:rotate(-45deg);
  background:linear-gradient(140deg,#34a853,#137333);
  box-shadow:0 14px 34px rgba(0,0,0,.4);position:relative}
.pin::after{content:'';position:absolute;inset:30px;border-radius:50%;background:#0f2a1a}
.pin.dim{opacity:.34}
.photo{position:absolute;inset:0}
.photo img{width:100%;height:100%;object-fit:cover;object-position:50% 26%}
.photo::after{content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,rgba(15,42,26,.72) 0%,rgba(15,42,26,.12) 34%,
             rgba(15,42,26,.10) 62%,rgba(15,42,26,.74) 100%)}
.crop{overflow:hidden}
.crop img{display:block;max-width:none}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:90px 90px}
"""

def bar():
    return ('<div class="bar"><span class="dot" style="background:#ff5f57"></span>'
            '<span class="dot" style="background:#febc2e"></span>'
            '<span class="dot" style="background:#28c840"></span></div>')

def shot(src, h, top=0):
    return (f'<div class="shot" style="height:{h}px">'
            f'<img src="{src}" style="margin-top:{top}px"></div>')

SESSIONS = [
    dict(out="beach-cleanup-banner.png", title="What a Beach Cleanup Actually Tells Us",
         date="Saturday, September 26, 2026",
         tag="Trash collected at one of<br>our own beach cleanups",
         right='<div class="photo"><img src="beach_cleanup1.jpeg"></div>'),
    dict(out="home-footprint-banner.png", title="Your Home's Water<br>and Energy Footprint",
         date="Saturday, October 10, 2026",
         tag="GreenLedger — water and energy data,<br>built by EcoQuest students",
         right=f'<div class="frame">{bar()}{shot("greenledger.png", 620)}</div>'),
    dict(out="climate-anxiety-banner.png",
         title="Climate Anxiety and How We Built MindMirror",
         date="Saturday, October 24, 2026",
         tag="MindMirror — a check-in built<br>by EcoQuest students",
         right='<div class="frame">' + bar() +
               '<div class="shot crop" style="height:313px">'
               '<img src="mindmirror.png" style="width:1767px;margin-top:-88px;margin-left:-403px">'
               '</div></div>'),
    dict(out="local-conservation-banner.png", title="Conservation in Your Own Neighborhood",
         date="Saturday, November 7, 2026", tag="Free · Open to anyone",
         right='<div class="grid"></div><div class="motif"><div class="pins">'
               + ''.join(f'<div class="pin{" dim" if d else ""}"></div>'
                         for d in (0, 1, 0, 1, 1, 0, 1, 0)) + '</div></div>'),
]

TPL = """<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>
<div class="left">
  <div class="brandrow"><img src="logo.png">
    <div><div class="brandname">EcoQuest Foundation</div>
      <div class="brandsub">Student-led 501(c)(3) nonprofit</div></div></div>
  <div class="kicker">Free Online Seminar</div>
  <h1>{title}</h1>
  <div class="meta">{date}<br><span>11:00 – 11:40 AM Pacific · on Zoom</span></div>
  <div class="free">Free and open to anyone · ecoquestfoundation.org</div>
</div>
<div class="right">{right}<div class="tag">{tag}</div></div>
</body></html>"""

here = pathlib.Path(__file__).parent.resolve()
for s in SESSIONS:
    html = here / (s["out"].replace(".png", ".html"))
    html.write_text(TPL.format(css=CSS, **s))
    subprocess.run([CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=1", "--window-size=2160,1080",
                    "--allow-file-access-from-files",
                    f"--screenshot={here / s['out']}", f"file://{html}"],
                   check=True, capture_output=True)
    print("rendered", s["out"])
