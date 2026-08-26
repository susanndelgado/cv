<p align="center">
  <img src="img/logoCircle.svg" alt="Susan Delgado portfolio mark" width="150">
</p>

# Susan Delgado — Portfolio Website

**Live site:** https://sdelgado.com  
**Repository:** https://github.com/susanndelgado/cv

This repository contains the source for Susan Delgado's multidisciplinary portfolio website, bringing together two primary areas of professional practice:

- **Fine Arts**
- **Technical Work**

The site uses a shared navigation and structural system while allowing the Fine Arts and Technical Work sections to maintain distinct visual identities.

---

## Portfolio Areas

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="img/FemaleSaytress.jpg" alt="Representative narrative fine art work" width="100%">
      <br>
      <strong>Fine Arts</strong><br>
      Painting, illustration, visual storytelling, wildlife, academic studies, exhibitions, process documentation, and ongoing artistic development.
    </td>
    <td width="50%" valign="top">
      <img src="showcase/img/abiomed-2017-header.jpg" alt="Representative technical portfolio project" width="100%">
      <br>
      <strong>Technical Work</strong><br>
      Front-end development, responsive interfaces, digital production, design implementation, email development, and technical case studies.
    </td>
  </tr>
</table>

---

## Fine Arts

The Fine Arts section presents painting, illustration, visual storytelling, academic studies, exhibitions, process documentation, and ongoing artistic development.

<p align="center">
  <img src="img/Crested-Brown-Pelican-20260717_141844.jpg" alt="Crested Brown Pelican artwork" width="65%">
</p>

Primary pages include:

- `finearts.html` — Fine Arts landing page
- `about.html` — Artist background, process, and development
- `exhibits.html` — Exhibition information
- `progress-chronicles.html` — Ongoing artistic progress and study documentation
- `gallery-narrative.html` — Narrative and symbolic work
- `gallery-wildlife.html` — Wildlife and nature work
- `gallery-decorative.html` — Decorative and atmospheric work
- `gallery-studies.html` — Academic studies and master copies

---

## Technical Work

The Technical Work section presents selected development, interface, digital production, design, and implementation projects.

It includes:

- Selected technical and design projects
- Case studies
- Project filtering
- Development process documentation
- Skills and capability summaries
- Project-specific implementation details
- Resume and contact access

Supporting pages include:

- `work.html` — Technical portfolio landing page
- `project.html` — Individual technical project / case-study view
- `resume.html` — Web-based resume
- `contact.html` — Contact and professional information

---

## Technology

The site is primarily built with:

- HTML5
- CSS3
- JavaScript
- jQuery
- Bootstrap 5
- JSON-based project data

The project also uses responsive layouts, CSS Grid, Flexbox, custom breakpoints, dynamic case-study rendering, interactive filtering, print styling, and custom-domain deployment support.

---

## Project Data

### `js/casestudies.json`

Structured project and case-study data used by the technical portfolio.

### `js/global.js`

Shared JavaScript behavior and dynamic site functionality.

Keeping project data separate from the main HTML allows technical project information to be reused across portfolio views.

---

## Styling

### `css/styles.css`

The main stylesheet contains shared site foundations and page-specific systems for:

- Navigation
- Shared hero and media components
- Fine Arts
- Galleries
- Exhibitions
- Progress Chronicles
- Technical Work
- Technical case studies
- Contact
- Resume
- Responsive layouts
- Reduced-motion support
- Print / resume formatting

The Fine Arts and Technical Work areas intentionally use different accent systems while remaining part of the same site.

---

## Directory Overview

```text
/
|-- index.html
|-- finearts.html
|-- about.html
|-- exhibits.html
|-- progress-chronicles.html
|-- gallery-narrative.html
|-- gallery-wildlife.html
|-- gallery-decorative.html
|-- gallery-studies.html
|-- work.html
|-- project.html
|-- contact.html
|-- resume.html
|
|-- css/
|   `-- styles.css
|
|-- js/
|   |-- global.js
|   `-- casestudies.json
|
|-- img/
|   `-- Artwork, logos, and visual assets
|
|-- showcase/
|   `-- Technical portfolio and case-study assets
|
|-- tpl/
|-- Archived/
|-- CNAME
|-- sitemap.xml
|-- robots.txt
`-- favicon.ico
```

---

## Running Locally

Because the site uses root-relative asset paths and JavaScript-driven content, it is best viewed through a local web server.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Deployment

The repository contains the public portfolio source and a `CNAME` file for the custom domain.

**Live site:** https://sdelgado.com

---

## Content and Assets

This repository contains original portfolio code, professional case-study material, artwork, project imagery, resume content, and exhibition documentation.

Artwork, images, written content, and professional project materials should not be assumed to be licensed for redistribution or reuse.

---

## Development Status

This is an actively maintained portfolio. Content, project case studies, responsive behavior, and documentation may continue to evolve.

---

## Developer Sandbox

A separate **Developer Sandbox** is being developed as an interactive environment for experiments, technical studies, reference material, development projects, and application-oriented work.

The Sandbox may be moved to a separate repository and is intentionally not documented in detail here.
