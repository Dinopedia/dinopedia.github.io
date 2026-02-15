# Dino-pedia

Dino-pedia is a static encyclopedia web app for dinosaurs, with searchable listings, article pages, dark/light mode, and local/public hosting support.

## Features

- Large dataset (`79` dinosaurs and growing)
- Home filters: search, period, diet, sort, new-only, favorites-only, era timeline, and region chips
- URL-synced filter state (shareable links)
- Daily `Did You Know` spotlight
- Favorites + comparison list (localStorage)
- Pagination (`Load more`) for better performance
- Detailed article pages with:
  - quick facts infobox
  - narrative and list-based section rendering
  - section quick-jump navigation
  - tags
  - pronunciation and name-origin helper text
  - related dinosaur recommendations
  - print / save-as-PDF support
- Comparison lab (`compare.html`)
- Optimizable quiz (`quiz.html`)
- Local admin JSON editor (`admin.html`)
- Dark/light toggle with persisted preference
- Local hosting script for Windows (`start-local.ps1`)

## Project Structure

- `index.html` - homepage
- `home.js` - homepage logic (filter/sort/pagination/render)
- `dino.html` / `article.html` - article template
- `article.js` - article data loading and rendering
- `compare.html` / `compare.js` - side-by-side comparison page
- `quiz.html` / `quiz.js` - configurable quiz mode
- `admin.html` / `admin.js` - local JSON editing/export tooling
- `style.css` - site styles (light/dark compatible)
- `theme.js` - theme toggle logic
- `data/index.json` - list/index data for cards
- `data/<id>.json` - per-dinosaur article data

## Run Locally (Windows)

```powershell
cd "C:\Users\jaxba\Dino-wiki"
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

Then open:

- `http://localhost:8080`

## Public Hosting (Free)

For free public hosting with a subdomain, use GitHub Pages, Netlify, Cloudflare Pages, or Vercel.

## Notes

- Images support both local paths and full remote URLs.
- Data is JSON-driven, so adding/editing dinosaurs only requires changes in `data/` files.
