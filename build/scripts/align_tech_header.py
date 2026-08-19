#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("work.html", "showcase.html")


def align_header(path: Path) -> None:
    text = path.read_text(encoding="utf-8")

    # index.html leaves the Fine Arts / Technical Work tab row full-width,
    # then places the main SUSAN DELGADO navbar inside a container-fluid.
    text = text.replace(
        '<div class="container-fluid"><ul class="nav nav-tabs">',
        '<div><ul class="nav nav-tabs">',
        1,
    )

    nav_start = '<nav class="navbar navbar-expand-lg navbar-light page-nav">'
    wrapper_start = '<div class="container-fluid tech-main-nav">\n'

    if wrapper_start not in text and nav_start in text:
        start = text.index(nav_start)
        end = text.index('</nav>', start) + len('</nav>')
        nav = text[start:end]
        text = text[:start] + wrapper_start + nav + '\n  </div>' + text[end:]

    path.write_text(text, encoding="utf-8")


for page in PAGES:
    align_header(ROOT / page)
