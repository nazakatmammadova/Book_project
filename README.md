# Sky Book

A responsive static bookstore website: home page, catalog, book detail page and a shopping cart.
Plain HTML, CSS and JavaScript, with no build step and no framework.

## Run

Book data is loaded from a JSON file with `fetch()`, which browsers block for pages opened
directly from disk (`file://`). Serve the folder through a local server instead, for example:

- VS Code → **Live Server** extension → "Open with Live Server"
- or `npx serve .` in the project folder

## Structure

```
├── index.html            Home page (hero slider, author, 6 featured books, stats, gallery, contact)
├── catalog.html          Catalog with category filters and search (supports ?category=fantasy)
├── book.html             Book detail page (book.html?id=14)
└── assets/
    ├── data/
    │   └── books.json    All books and categories (single source of truth)
    ├── css/
    │   ├── base.css      Design tokens, reset, header, book card, cart drawer, footer
    │   ├── home.css      Home-page sections
    │   ├── catalog.css   Catalog layout, filters and search
    │   └── book.css      Book detail page
    ├── js/
    │   ├── store.js      Loads books.json once; shared render helpers (book card, prices)
    │   ├── layout.js     Header, mobile menu, overlay
    │   ├── cart.js       Cart state (saved in localStorage) and drawer
    │   ├── home.js       Slider, featured books, stats counters, contact form
    │   ├── catalog.js    Filters and search
    │   └── book.js       Detail page, quantity picker, related books
    └── images/
        ├── brand/  hero/  authors/  books/  gallery/  backgrounds/
```

Scripts are loaded with `defer` in this order: `store.js` → `layout.js` → `cart.js` → page script.

## Adding a book

Add an object to `books` in `assets/data/books.json` and put the cover in `assets/images/books/`:

```json
{
  "id": 26,
  "title": "Book title",
  "author": "Author name",
  "price": 30,
  "category": "fantasy",
  "image": "book30.jpg",
  "format": "Paperback",
  "language": "English",
  "stock": 10,
  "description": "Short description shown on the detail page."
}
```

Add `"featured": true` to show it on the home page (keep 6 featured books so the rows stay full).
`category` must be one of the `id`s in `categories`.
