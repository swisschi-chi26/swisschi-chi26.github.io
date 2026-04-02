# 🇨🇭 Swiss Papers at CHI 2026

A web app showcasing Swiss research contributions at CHI 2026 (Yokohama, April 26 - May 1, 2026).

**Live site:** https://swisschi-chi26.github.io/

## Features

- Browse all Swiss papers and posters at CHI 2026
- Filter by type, institution, author, or award
- Clickable tags for quick filtering
- View author messages
- Best Paper 🏆 and Honorable Mention 🏅 highlights

## Data Source

Data is fetched from a Google Sheet published as CSV. Update the `SHEET_CSV_URL` in `src/App.jsx` to use your own data.

Required columns:
- `ID`, `Link`, `Title`, `Type`, `Awards`
- `Author's Message`, `Swiss Institutes`, `Swiss Authors`
- `Swiss Authors Count`, `All Authors`, `Abstract`

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

This pushes the built site to the `gh-pages` branch.

## Project by

[SwissCHI](https://swisschi.acm.org/) - The Swiss ACM SIGCHI Chapter

- Website: https://swisschi.acm.org/
- LinkedIn: https://www.linkedin.com/company/swisschi/
