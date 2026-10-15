// Book detail page: reads ?id= from the URL and renders that book from books.json.

(() => {
  const root = document.getElementById("book-detail");
  const relatedSection = document.getElementById("related");
  const relatedGrid = document.getElementById("related-books");
  const RELATED_COUNT = 3;

  const id = Number(new URLSearchParams(location.search).get("id"));

  Store.load()
    .then(({ books, categories }) => {
      const book = books.find((item) => item.id === id);
      if (!book) {
        renderNotFound();
        return;
      }
      renderBook(book, categories);
      renderRelated(book, books, categories);
    })
    .catch(() => renderLoadError(root));

  function renderBook(book, categories) {
    const title = escapeHtml(book.title);
    const categoryName = categories[book.category];
    const categoryUrl = `catalog.html?category=${book.category}`;

    document.title = `${book.title} — Sky Book`;

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <a href="catalog.html">Catalog</a>
        <a href="${categoryUrl}">${categoryName}</a>
        <span aria-current="page">${title}</span>
      </nav>

      <div class="book-detail">
        <div class="book-detail__media">
          <img src="${BOOK_IMAGE_PATH + book.image}" alt="${title} cover" width="320" height="480">
        </div>

        <div class="book-detail__info">
          <a class="chip" href="${categoryUrl}">${categoryName}</a>
          <h1 class="book-detail__title">${title}</h1>
          <p class="book-detail__author">by <strong>${escapeHtml(book.author)}</strong></p>

          <div class="book-detail__price-row">
            <span class="book-detail__price">${formatPrice(book.price)}</span>
            ${stockBadge(book.stock)}
          </div>

          <p class="book-detail__description">${escapeHtml(book.description)}</p>

          <div class="purchase">
            <div class="qty qty--lg" role="group" aria-label="Quantity">
              <button type="button" data-step="-1" aria-label="Decrease quantity"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
              <span id="purchase-qty">1</span>
              <button type="button" data-step="1" aria-label="Increase quantity"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
            </div>
            <button class="btn btn--primary purchase__add" type="button" ${book.stock ? "" : "disabled"}>
              <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to cart
            </button>
          </div>

          <dl class="specs">
            <div><dt>Author</dt><dd>${escapeHtml(book.author)}</dd></div>
            <div><dt>Category</dt><dd><a href="${categoryUrl}">${categoryName}</a></dd></div>
            <div><dt>Format</dt><dd>${escapeHtml(book.format)}</dd></div>
            <div><dt>Language</dt><dd>${escapeHtml(book.language)}</dd></div>
            <div><dt>Book code</dt><dd>SKY-${String(book.id).padStart(4, "0")}</dd></div>
          </dl>

          <ul class="perks">
            <li><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Free delivery over $50</li>
            <li><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> 14-day easy returns</li>
            <li><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Secure payment</li>
          </ul>
        </div>
      </div>`;

    setupPurchase(book);
  }

  function stockBadge(stock) {
    if (!stock) return '<span class="stock stock--out">Out of stock</span>';
    if (stock <= 3) return `<span class="stock stock--low">Only ${stock} left</span>`;
    return '<span class="stock">In stock</span>';
  }

  function setupPurchase(book) {
    const qtyEl = document.getElementById("purchase-qty");
    const addBtn = root.querySelector(".purchase__add");
    const maxQty = Math.max(book.stock, 1);
    let qty = 1;

    root.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        qty = Math.min(maxQty, Math.max(1, qty + Number(button.dataset.step)));
        qtyEl.textContent = qty;
      });
    });

    addBtn.addEventListener("click", () => {
      Cart.add(book.id, qty);
      addBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Added to cart';
      addBtn.classList.add("is-added");
      setTimeout(() => {
        addBtn.innerHTML = '<i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to cart';
        addBtn.classList.remove("is-added");
      }, 1500);
    });
  }

  // Same category first, then fill up with other books
  function renderRelated(book, books, categories) {
    const others = books.filter((item) => item.id !== book.id);
    const related = [
      ...others.filter((item) => item.category === book.category),
      ...others.filter((item) => item.category !== book.category),
    ].slice(0, RELATED_COUNT);

    relatedGrid.innerHTML = related.map((item) => renderBookCard(item, categories)).join("");
    relatedSection.hidden = false;
  }

  function renderNotFound() {
    document.title = "Book not found — Sky Book";
    root.innerHTML = `
      <div class="not-found">
        <i class="fa-solid fa-book-open" aria-hidden="true"></i>
        <h1>Book not found</h1>
        <p>The book you are looking for doesn't exist or has been removed.</p>
        <a class="btn btn--primary" href="catalog.html">Back to catalog</a>
      </div>`;
  }
})();
