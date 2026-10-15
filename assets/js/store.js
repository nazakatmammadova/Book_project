// Data layer: loads assets/data/books.json once and shares it with every script.
// Also holds the small helpers used to render books on any page.

const Store = (() => {
  const DATA_URL = "assets/data/books.json";
  let request = null;

  // Returns a promise of { books, categories }. The file is fetched only once.
  function load() {
    if (!request) {
      request = fetch(DATA_URL)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => {
          const categories = Object.fromEntries(data.categories.map((c) => [c.id, c.name]));
          return { books: data.books, categories };
        });
    }
    return request;
  }

  return { load };
})();

const BOOK_IMAGE_PATH = "assets/images/books/";

function bookUrl(book) {
  return `book.html?id=${book.id}`;
}

function formatPrice(value) {
  return "$" + value.toFixed(2);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);
}

function renderBookCard(book, categories) {
  const title = escapeHtml(book.title);
  return `
    <article class="book-card">
      <a class="book-card__cover" href="${bookUrl(book)}" tabindex="-1" aria-hidden="true">
        <img src="${BOOK_IMAGE_PATH + book.image}" alt="" loading="lazy" width="104" height="156">
      </a>
      <div class="book-card__body">
        <span class="book-card__category">${categories[book.category]}</span>
        <h3 class="book-card__title"><a href="${bookUrl(book)}">${title}</a></h3>
        <p class="book-card__author">${escapeHtml(book.author)}</p>
        <div class="book-card__footer">
          <span class="book-card__price">${formatPrice(book.price)}</span>
          <button class="add-to-cart" type="button" data-add-to-cart="${book.id}" aria-label="Add ${title} to cart">
            <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add
          </button>
        </div>
      </div>
    </article>`;
}

// Shown in place of content when books.json cannot be loaded
// (most often because the page was opened as file:// instead of through a server).
function renderLoadError(container) {
  container.classList.remove("book-grid", "book-grid--three");
  container.innerHTML = `
    <div class="load-error">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <p><strong>Books could not be loaded.</strong></p>
      <p>Open the site through a local server (for example VS Code Live Server) instead of double-clicking the HTML file.</p>
    </div>`;
}
