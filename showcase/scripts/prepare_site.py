#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re
import sys
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://sdelgado.com"

MEMBERSHIPS = [
    ("Burlington County Art Guild", "https://burlcoartguild.com/"),
    ("Willingboro Art Alliance", "https://willingboroart.org/"),
    ("South Jersey Cultural Alliance", "https://www.sjca.net/"),
    ("Perkins Center for the Arts", "https://perkinsarts.org/"),
]

PAGE_META = {
    "index.html": {
        "title": "Susan Delgado | Fine Artist & Visual Storyteller",
        "description": "Portfolio of Susan Delgado, a Cuban-American fine artist and visual storyteller creating narrative, wildlife, decorative and academic works rooted in classical study and imaginative worldbuilding.",
        "image": "/img/FemaleSaytress.jpg",
        "type": "ProfilePage",
        "canonical": "/",
    },
    "about.html": {
        "title": "About Susan Delgado | Fine Artist & Creative Process",
        "description": "Learn about Susan Delgado, her classical fine-art process, visual storytelling practice, teaching, creative development and South Jersey arts-community memberships.",
        "image": "/img/FemaleSaytress.jpg",
        "type": "AboutPage",
    },
    "exhibits.html": {
        "title": "Exhibitions | Susan Delgado Fine Art",
        "description": "Exhibitions, juried shows and public presentations of fine-art work by Susan Delgado in South Jersey and beyond.",
        "image": "/img/FemaleSaytress.jpg",
        "type": "CollectionPage",
    },
    "narrative-gallery.html": {
        "title": "Narrative & Symbolic Art | Susan Delgado",
        "description": "Narrative and symbolic paintings by Susan Delgado exploring fantasy, mythology, memory, expressive figures and visual storytelling.",
        "image": "/img/FemaleSaytress.jpg",
        "type": "CollectionPage",
    },
    "wildlife-gallery.html": {
        "title": "Wildlife Art | Susan Delgado",
        "description": "Wildlife and nature paintings by Susan Delgado, including observational animal studies and atmospheric natural environments.",
        "image": "/img/Crested-Brown-Pelican-20260717_141844.jpg",
        "type": "CollectionPage",
    },
    "decorative-gallery.html": {
        "title": "Decorative & Whimsical Art | Susan Delgado",
        "description": "Decorative, whimsical, floral and romantic atmospheric artwork by fine artist Susan Delgado.",
        "image": "/img/b8300038-b441-4cac-ad11-a4c779e0668c.jpeg",
        "type": "CollectionPage",
    },
    "studies-gallery.html": {
        "title": "Academic Studies & Master Copies | Susan Delgado",
        "description": "Classical studies, master copies, still life and academic fine-art exercises by Susan Delgado.",
        "image": "/img/GirlwPearlVermeer.jpg",
        "type": "CollectionPage",
    },
    "progress-chronicles.html": {
        "title": "Progress Chronicles | Susan Delgado",
        "description": "Follow Susan Delgado’s evolving fine-art practice through works in progress, studio development, research and creative process notes.",
        "image": "/img/462558539_900031218775586_409832144205821387_n.jpg",
        "type": "Blog",
    },
    "work.html": {
        "title": "Technical Work | Susan Delgado — Front End, Email & Graphic Design",
        "description": "Professional portfolio of Susan Delgado featuring front-end web development, responsive conference sites, Salesforce Pardot email development, branding, publication design and print collateral.",
        "image": "/img/tct20151.jpg",
        "type": "CollectionPage",
    },
    "showcase.html": {
        "title": "Project Showcase | Susan Delgado",
        "description": "Detailed project case studies by Susan Delgado spanning front-end development, email development, conference websites, branding, publication design and print production.",
        "image": "/img/tct20151.jpg",
        "type": "CollectionPage",
    },
    "code.html": {
        "title": "Code & Front-End Examples | Susan Delgado",
        "description": "Front-end and web-development examples from Susan Delgado covering HTML, CSS, JavaScript, jQuery, PHP and development tools.",
        "image": "/img/tct20151.jpg",
        "type": "CollectionPage",
    },
    "contact.html": {
        "title": "Contact Susan Delgado | Fine Art, Design & Web Development",
        "description": "Contact Susan Delgado for fine art, private tutoring, graphic design, front-end development and professional portfolio inquiries.",
        "image": "/img/FemaleSaytress.jpg",
        "type": "ContactPage",
    },
}

GUILD_PATTERN = re.compile(
    r'(<h3[^>]*>\s*)(?:The Burlington Guild Of Master Craftsmen & Fine Arts|GUILDS AND COMMUNITY)(\s*</h3>\s*<p[^>]*>).*?(</p>\s*<span[^>]*>).*?(</span>)',
    re.IGNORECASE | re.DOTALL,
)

TECH_FOOTER = '''<footer class="tech-footer py-4 border-top mt-5 text-center" style="background:#000;color:#fff;">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <p class="small text-uppercase mb-2">&copy; 2026 Susan Nicole Arts | Susan Nicole Delgado</p>
        <p class="small mb-2">Grounded in the philosophy that <em>"Dreams are the Foundation of Reality."</em></p>
        <div class="d-flex justify-content-center gap-3">
          <a href="/contact.html" class="small" style="color:#fff;">Contact</a><span>|</span>
          <a href="/sitemap.xml" target="_blank" class="small" style="color:#fff;">Sitemap</a>
        </div>
      </div>
    </div>
  </div>
</footer>'''

BOOTSTRAP_CSS = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">'
BOOTSTRAP_JS = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>'


def strip_tags(value: str) -> str:
    return re.sub(r'<[^>]+>', ' ', value or '').replace('&amp;', '&').strip()


def page_url(rel: str, meta: dict) -> str:
    canonical = meta.get("canonical")
    if canonical:
        return SITE + canonical
    return f"{SITE}/{rel}"


def replace_title(text: str, title: str) -> str:
    if re.search(r'<title>.*?</title>', text, flags=re.I | re.S):
        return re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', text, count=1, flags=re.I | re.S)
    return text.replace('</head>', f'  <title>{html.escape(title)}</title>\n</head>', 1)


def replace_description(text: str, description: str) -> str:
    tag = f'<meta name="description" content="{html.escape(description, quote=True)}">'
    pat = re.compile(r'<meta\s+name=["\']description["\'][^>]*>', re.I)
    if pat.search(text):
        return pat.sub(tag, text, count=1)
    return text.replace('</head>', f'  {tag}\n</head>', 1)


def seo_block(rel: str, meta: dict) -> str:
    title = meta["title"]
    desc = meta["description"]
    url = page_url(rel, meta)
    image = SITE + meta["image"]
    page_type = meta["type"]
    robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"

    person = {
        "@type": "Person",
        "@id": f"{SITE}/#susan-delgado",
        "name": "Susan Nicole Delgado",
        "alternateName": "Susan Delgado",
        "url": f"{SITE}/",
        "description": "Cuban-American fine artist, visual storyteller, front-end developer, email developer and graphic designer.",
        "memberOf": [
            {"@type": "Organization", "name": name, "url": url_}
            for name, url_ in MEMBERSHIPS
        ],
        "knowsAbout": [
            "Fine Art", "Oil Painting", "Visual Storytelling", "Illustration",
            "Front-End Web Development", "Responsive Web Development",
            "Email Development", "Salesforce Pardot", "Graphic Design"
        ],
    }
    webpage = {
        "@type": page_type,
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": desc,
        "isPartOf": {"@id": f"{SITE}/#website"},
        "about": {"@id": f"{SITE}/#susan-delgado"},
        "inLanguage": "en-US",
    }
    website = {
        "@type": "WebSite",
        "@id": f"{SITE}/#website",
        "url": f"{SITE}/",
        "name": "Susan Delgado",
        "publisher": {"@id": f"{SITE}/#susan-delgado"},
        "inLanguage": "en-US",
    }
    schema = json.dumps({"@context": "https://schema.org", "@graph": [website, person, webpage]}, ensure_ascii=False)
    return f'''<!-- SITE SEO START -->
<link rel="canonical" href="{html.escape(url, quote=True)}">
<meta name="robots" content="{robots}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Susan Delgado">
<meta property="og:title" content="{html.escape(title, quote=True)}">
<meta property="og:description" content="{html.escape(desc, quote=True)}">
<meta property="og:url" content="{html.escape(url, quote=True)}">
<meta property="og:image" content="{html.escape(image, quote=True)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{html.escape(title, quote=True)}">
<meta name="twitter:description" content="{html.escape(desc, quote=True)}">
<meta name="twitter:image" content="{html.escape(image, quote=True)}">
<script type="application/ld+json" id="siteSchema">{schema}</script>
<!-- SITE SEO END -->'''


def apply_seo(path: Path, rel: str, meta: dict) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'\s*<!-- SITE SEO START -->.*?<!-- SITE SEO END -->\s*', '\n', text, flags=re.S)
    text = replace_title(text, meta["title"])
    text = replace_description(text, meta["description"])
    block = seo_block(rel, meta)
    text = text.replace('</head>', block + '\n</head>', 1)
    path.write_text(text, encoding="utf-8")


def sync_guild_sections(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    membership_lines = '<br />\n                  '.join(
        f'<a href="{url}" target="_blank" rel="noopener">{name}</a>' for name, url in MEMBERSHIPS
    )
    paragraph = f'Susan is a member of {membership_lines}'

    def repl(match):
        return (
            match.group(1) + 'GUILDS AND COMMUNITY' + match.group(2) +
            '\n                  ' + paragraph + '\n                ' + match.group(3) +
            '— DO WHAT IS HARD BUT MAKES YOU PROUD! —' + match.group(4)
        )

    updated, count = GUILD_PATTERN.subn(repl, text)
    if count:
        path.write_text(updated, encoding="utf-8")
    return count


def modernize_code_page(path: Path) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'<link[^>]+bootstrap/4\.3\.1/css/bootstrap\.min\.css[^>]*>', BOOTSTRAP_CSS, text, count=1, flags=re.I)
    text = re.sub(r'<script[^>]+jquery-1\.11\.3\.min\.js[^>]*></script>\s*', '', text, flags=re.I)
    text = re.sub(r'<script[^>]+jquery-migrate-1\.2\.1\.min\.js[^>]*></script>\s*', '', text, flags=re.I)
    text = re.sub(r'<script[^>]+js/vendor/bootstrap\.min\.js[^>]*></script>\s*', '', text, flags=re.I)
    text = re.sub(r'<script[^>]+ajax\.googleapis\.com/ajax/libs/angularjs/1\.5\.8/angular\.min\.js[^>]*></script>\s*', '', text, flags=re.I)
    text = text.replace('data-toggle="collapse"', 'data-bs-toggle="collapse"').replace('data-target="#navbarSupportedContent"', 'data-bs-target="#navbarSupportedContent"')
    text = text.replace('data-toggle="dropdown"', 'data-bs-toggle="dropdown"')
    text = text.replace('navbar-nav ml-auto', 'navbar-nav ms-auto')
    text = re.sub(r'<footer id="footer">.*?</footer>', TECH_FOOTER, text, count=1, flags=re.I | re.S)
    if 'bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js' not in text:
        text = text.replace('</body>', BOOTSTRAP_JS + '\n</body>', 1)
    path.write_text(text, encoding="utf-8")


def retire_legacy_showcase_index(path: Path) -> None:
    if not path.exists():
        return
    path.write_text('''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="https://sdelgado.com/showcase.html">
  <meta http-equiv="refresh" content="0; url=/showcase.html">
  <title>Project Showcase | Susan Delgado</title>
</head>
<body><p><a href="/showcase.html">View Susan Delgado’s project showcase.</a></p></body>
</html>\n''', encoding="utf-8")


def merge_posts():
    base = json.loads((ROOT / 'js/posts.json').read_text(encoding='utf-8')).get('posts', [])
    extras = []
    for name in ('js/posts-extra.json', 'js/posts-corrections.json'):
        p = ROOT / name
        if p.exists():
            extras.append(json.loads(p.read_text(encoding='utf-8')))
    result = [dict(p) for p in base]
    for extra in extras:
        overrides = extra.get('overrides', {})
        result = [{**p, **overrides.get(str(p.get('id')), {})} for p in result]
        for post in extra.get('posts', []):
            idx = next((i for i, p in enumerate(result) if str(p.get('id')) == str(post.get('id'))), None)
            if idx is None:
                result.append(dict(post))
            else:
                result[idx] = {**result[idx], **post}
    visible = [p for p in result if not p.get('hidden')]
    visible.sort(key=lambda p: int(p.get('id', 10**9)))
    for public_id, post in enumerate(visible):
        post['public_id'] = public_id
    return visible


def resolve_local(raw: str, source: Path):
    raw = html.unescape(raw.strip())
    if not raw or raw.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:')):
        return None
    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    if path == '/':
        return ROOT / 'index.html'
    if path.startswith('/'):
        target = ROOT / path.lstrip('/')
    else:
        target = source.parent / path
    if path.endswith('/'):
        target = target / 'index.html'
    return target


def validate_site() -> int:
    missing = []
    warnings = []
    intentional = {
        'showcase/img/abiomed-2017-header.jpg',
        'showcase/thumbs/abiomed-2017-thumb.jpg',
        'showcase/img/abiomed-2017-preview.jpg',
    }

    full_pages = [p for p in ROOT.rglob('*.html') if '<html' in p.read_text(encoding='utf-8', errors='ignore').lower()]
    attr_re = re.compile(r'\b(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.I)
    for page in full_pages:
        text = re.sub(r'<!--.*?-->', '', page.read_text(encoding='utf-8', errors='ignore'), flags=re.S)
        for raw in attr_re.findall(text):
            target = resolve_local(raw, page)
            if target is None:
                continue
            rel = target.relative_to(ROOT).as_posix() if target.is_absolute() and ROOT in target.parents else str(target)
            if target.exists():
                continue
            if rel in intentional:
                warnings.append(f'Intentional pending asset: {rel}')
            else:
                missing.append(f'{page.relative_to(ROOT)} -> {raw}')

    posts = merge_posts()
    expected = list(range(len(posts)))
    actual = [p['public_id'] for p in posts]
    if actual != expected:
        missing.append('Public Showcase IDs are not contiguous.')
    for post in posts:
        link = ROOT / str(post.get('link', ''))
        if not link.exists():
            missing.append(f"Post {post['public_id']} missing detail file: {post.get('link')}")
        for field in ('image', 'thumb'):
            value = str(post.get(field, '')).lstrip('/')
            if not value:
                warnings.append(f"Post {post['public_id']} has no {field}.")
                continue
            if not (ROOT / value).exists():
                if value in intentional:
                    warnings.append(f"Post {post['public_id']} intentional pending {field}: {value}")
                else:
                    missing.append(f"Post {post['public_id']} missing {field}: {value}")

    for item in warnings:
        print('WARNING:', item)
    if missing:
        print('\nSITE INTEGRITY ERRORS:')
        for item in missing:
            print('ERROR:', item)
        return 1
    print(f'Site integrity check passed: {len(full_pages)} full HTML pages and {len(posts)} visible showcase posts checked.')
    return 0


def main():
    # Keep community information consistent anywhere this section appears.
    guild_updates = 0
    for path in ROOT.rglob('*.html'):
        if '<html' in path.read_text(encoding='utf-8', errors='ignore').lower():
            guild_updates += sync_guild_sections(path)

    # Keep the technology-side code page on the same Bootstrap generation as index/work/showcase.
    modernize_code_page(ROOT / 'code.html')
    retire_legacy_showcase_index(ROOT / 'showcase/index.html')

    # Apply static SEO/schema to every primary full page. Showcase adds project-specific metadata at runtime.
    for rel, meta in PAGE_META.items():
        path = ROOT / rel
        if path.exists():
            apply_seo(path, rel, meta)

    print(f'Guild/community sections synchronized: {guild_updates}')
    return validate_site()


if __name__ == '__main__':
    sys.exit(main())
