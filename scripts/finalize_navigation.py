#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAV_SCRIPT = ROOT / "js/vendor/modernizr-2.8.3.min.js"


def main() -> None:
    text = NAV_SCRIPT.read_text(encoding="utf-8")

    art_old = """          li('/finearts.html','FINE ARTS',path==='/finearts.html')+\n          li('/about.html','ABOUT',path==='/about.html')+\n          li('/exhibits.html','EXHIBITIONS',path==='/exhibits.html')+\n          li('/progress-chronicles.html','PROGRESS CHRONICLES',path==='/progress-chronicles.html');"""
    art_new = """          li('/finearts.html','FINE ARTS',path==='/finearts.html')+\n          li('/about.html','ABOUT',path==='/about.html')+\n          li('/exhibits.html','EXHIBITIONS',path==='/exhibits.html')+\n          li('/progress-chronicles.html','PROGRESS CHRONICLES',path==='/progress-chronicles.html')+\n          li('/contact.html','CONTACT',false);"""

    tech_old = """          li('/work.html','TECHNICAL WORK',path==='/work.html')+\n          li('/showcase.html','SHOWCASE',path==='/showcase.html');"""
    tech_new = """          li('/work.html','TECHNICAL WORK',path==='/work.html')+\n          li('/showcase.html','SHOWCASE',path==='/showcase.html')+\n          li('/contact.html','CONTACT',false);"""

    if art_old in text:
        text = text.replace(art_old, art_new, 1)
    elif art_new not in text:
        raise SystemExit("Art navigation pattern was not found.")

    if tech_old in text:
        text = text.replace(tech_old, tech_new, 1)
    elif tech_new not in text:
        raise SystemExit("Technical navigation pattern was not found.")

    NAV_SCRIPT.write_text(text, encoding="utf-8")
    print("Navigation normalized: CONTACT restored to art and technical sections.")


if __name__ == "__main__":
    main()
