#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

COMMUNITY_CONTENT = '''<h3 style="color: #fff; letter-spacing: 5px; text-transform: uppercase; font-size: 1rem; margin-bottom: 15px;">
                  GUILDS AND COMMUNITY
                </h3>
                <p style="color: #999; font-family: 'Open Sans', sans-serif; font-weight: 300; line-height: 2; font-style: italic;">
                  Susan is a member of <a href="https://burlcoartguild.com/" target="_blank" rel="noopener" style="font-weight: inherit;">Burlington County Art Guild</a>,
                  <a href="https://willingboroart.org/" target="_blank" rel="noopener" style="font-weight: inherit;">Willingboro Art Alliance</a>,
                  <a href="https://perkinsarts.org/" target="_blank" rel="noopener" style="font-weight: inherit;">Perkins Center for the Arts</a> and the
                  <a href="https://www.sjca.net/" target="_blank" rel="noopener" style="font-weight: inherit;">South Jersey Cultural Alliance</a>
                </p>
                <span style="color: #555; font-size: 0.8rem; letter-spacing: 2px;">— DO WHAT IS HARD BUT MAKES YOU PROUD! —</span>'''

# Match both the former Burlington Guild text and the current Guilds & Community
# block. The paragraph closing tag is optional because one older source copy was
# missing it; the replacement always writes valid, consistent markup.
COMMUNITY_RE = re.compile(
    r'<h3[^>]*>\s*(?:The Burlington Guild Of Master Craftsmen & Fine Arts|GUILDS AND COMMUNITY)\s*</h3>\s*'
    r'<p[^>]*>.*?(?:</p>\s*)?<span[^>]*>.*?</span>',
    re.IGNORECASE | re.DOTALL,
)

WORK_FILTERS = '<div id="page-nav"><button class="btn active" data-filter="all">Show all</button><button class="btn" data-filter="brand">Branding & Logo</button><button class="btn" data-filter="conf">Conferences & Campaigns</button><button class="btn" data-filter="dig">Digital</button><button class="btn" data-filter="email">Email Development</button><button class="btn" data-filter="print">Print Collateral</button><button class="btn" data-filter="web">Websites</button></div>'
WORK_FILTER_RE = re.compile(r'<div id="page-nav">.*?</div>', re.IGNORECASE | re.DOTALL)


def sync_community(path: Path) -> int:
    text = path.read_text(encoding='utf-8')
    updated, count = COMMUNITY_RE.subn(COMMUNITY_CONTENT, text)
    if count:
        path.write_text(updated, encoding='utf-8')
    return count


def align_tech_header(path: Path) -> None:
    text = path.read_text(encoding='utf-8')

    # Match index.html: tabs are full-width; the main navbar is inside container-fluid.
    text = text.replace(
        '<div class="container-fluid"><ul class="nav nav-tabs">',
        '<div><ul class="nav nav-tabs">',
        1,
    )

    marker = '<div class="container-fluid tech-main-nav">'
    nav_start = '<nav class="navbar navbar-expand-lg navbar-light page-nav">'
    if marker not in text and nav_start in text:
        start = text.index(nav_start)
        end = text.index('</nav>', start) + len('</nav>')
        nav = text[start:end]
        text = text[:start] + marker + '\n  ' + nav + '\n  </div>' + text[end:]

    path.write_text(text, encoding='utf-8')


def normalize_work_filter_bar(path: Path) -> None:
    text = path.read_text(encoding='utf-8')
    updated, count = WORK_FILTER_RE.subn(WORK_FILTERS, text, count=1)
    if count:
        path.write_text(updated, encoding='utf-8')


community_count = 0
for page in ROOT.rglob('*.html'):
    try:
        text = page.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    if '<html' in text.lower():
        community_count += sync_community(page)

for name in ('work.html', 'showcase.html'):
    path = ROOT / name
    if path.exists():
        align_tech_header(path)

work_path = ROOT / 'work.html'
if work_path.exists():
    normalize_work_filter_bar(work_path)

print(f'Final display patches applied. Guild/community sections synchronized: {community_count}')
