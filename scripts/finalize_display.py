#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# Keep the existing visual treatment from the art pages. Only the membership
# names/order are normalized. The motto remains a separate, smaller faded line.
COMMUNITY_CONTENT = '''<h3 style="color: #fff; letter-spacing: 5px; text-transform: uppercase; font-size: 1rem; margin-bottom: 15px;">
                  GUILDS AND COMMUNITY
                </h3>
                <p style="color: #999; font-family: 'Open Sans', sans-serif; font-weight: 300; line-height: 2; font-style: italic;">
                  Susan is a member of <a href="https://burlcoartguild.com/" target="_blank">Burlington County Art Guild</a>,<br />
                  <a href="https://willingboroart.org/" target="_blank">Willingboro Art Alliance</a>,<br />
                  <a href="https://perkinsarts.org/" target="_blank">Perkins Center for the Arts</a><br />
                  and the <a href="https://www.sjca.net/" target="_blank">South Jersey Cultural Alliance</a>
                </p>
                <span style="color: #555; font-size: 0.8rem; letter-spacing: 2px;">— DO WHAT IS HARD BUT MAKES YOU PROUD! —</span>'''

# Match both the former Burlington Guild text and the current Guilds & Community
# block. The paragraph closing tag is optional because one older About copy was
# missing it; the replacement always writes valid, consistent markup.
COMMUNITY_RE = re.compile(
    r'<h3[^>]*>\s*(?:The Burlington Guild Of Master Craftsmen & Fine Arts|GUILDS AND COMMUNITY)\s*</h3>\s*'
    r'<p[^>]*>.*?(?:</p>\s*)?<span[^>]*>.*?</span>',
    re.IGNORECASE | re.DOTALL,
)

WORK_FILTERS = '<div id="page-nav"><button class="btn active" data-filter="all">Show all</button><button class="btn" data-filter="brand">Branding & Logo</button><button class="btn" data-filter="conf">Conferences & Campaigns</button><button class="btn" data-filter="dig">Digital</button><button class="btn" data-filter="email">Email Development</button><button class="btn" data-filter="print">Print Collateral</button><button class="btn" data-filter="web">Websites</button></div>'
WORK_FILTER_RE = re.compile(r'<div id="page-nav">.*?</div>', re.IGNORECASE | re.DOTALL)

LIVE_NAV_PAGES = (
    'finearts.html',
    'about.html',
    'exhibits.html',
    'progress-chronicles.html',
    'narrative-gallery.html',
    'wildlife-gallery.html',
    'decorative-gallery.html',
    'studies-gallery.html',
    'work.html',
    'showcase.html',
    'contact.html',
)

# Start the Google Apps Script request on the normal entry pages so the gallery
# JSON is already stored under the same cache keys used by the gallery pages.
GALLERY_PREFETCH_PAGES = (
    'index.html',
    'finearts.html',
    'about.html',
    'exhibits.html',
    'progress-chronicles.html',
)

NAV_SCRIPT = '<script src="/js/site-navigation.js"></script>'
GALLERY_PREFETCH_SCRIPT = '<script src="/js/gallery-prefetch.js"></script>'


def sync_community(path: Path) -> int:
    text = path.read_text(encoding='utf-8')
    updated, count = COMMUNITY_RE.subn(COMMUNITY_CONTENT, text)
    if count:
        path.write_text(updated, encoding='utf-8')
    return count


def align_tech_header(path: Path) -> None:
    text = path.read_text(encoding='utf-8')

    # Match index.html exactly in structure: tabs are full width and the main
    # navbar (including SUSAN DELGADO) sits inside Bootstrap's container-fluid.
    text = text.replace(
        '<div class="container-fluid"><ul class="nav nav-tabs">',
        '<div><ul class="nav nav-tabs">',
        1,
    )

    nav_start = '<nav class="navbar navbar-expand-lg navbar-light page-nav">'
    exact_wrapper = '<div class="container-fluid">\n  ' + nav_start
    legacy_wrapper = '<div class="container-fluid tech-main-nav">'

    # Normalize an earlier temporary wrapper if it exists.
    text = text.replace(legacy_wrapper, '<div class="container-fluid">', 1)

    if exact_wrapper not in text and nav_start in text:
        start = text.index(nav_start)
        end = text.index('</nav>', start) + len('</nav>')
        nav = text[start:end]
        text = text[:start] + '<div class="container-fluid">\n  ' + nav + '\n  </div>' + text[end:]

    path.write_text(text, encoding='utf-8')


def normalize_work_filter_bar(path: Path) -> None:
    text = path.read_text(encoding='utf-8')
    updated, count = WORK_FILTER_RE.subn(WORK_FILTERS, text, count=1)
    if count:
        path.write_text(updated, encoding='utf-8')


def inject_before(path: Path, closing_tag: str, snippet: str) -> bool:
    if not path.exists():
        return False
    text = path.read_text(encoding='utf-8')
    if snippet in text:
        return False
    idx = text.lower().rfind(closing_tag.lower())
    if idx == -1:
        return False
    text = text[:idx] + snippet + '\n' + text[idx:]
    path.write_text(text, encoding='utf-8')
    return True


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

nav_injected = 0
for name in LIVE_NAV_PAGES:
    if inject_before(ROOT / name, '</body>', NAV_SCRIPT):
        nav_injected += 1

prefetch_injected = 0
for name in GALLERY_PREFETCH_PAGES:
    # This script does not touch the DOM, so loading it in the head starts the
    # asynchronous archive request while the rest of the page is still parsing.
    if inject_before(ROOT / name, '</head>', GALLERY_PREFETCH_SCRIPT):
        prefetch_injected += 1

print(
    'Final display patches applied. '
    f'Guild/community sections synchronized: {community_count}; '
    f'live navigation scripts injected: {nav_injected}; '
    f'gallery cache warmups injected: {prefetch_injected}'
)
