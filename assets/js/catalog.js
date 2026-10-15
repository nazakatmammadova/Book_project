// Catalog page: category filters, search and book grid.
// No category selected = all books; selecting categories narrows the list.

(() => {
  const filterList = document.getElementById("filters");
  const clearBtn = document.getElementById("filters-clear");
  const grid = document.getElementById("catalog-books");
  const countEl = document.getElementById("catalog-count");
  const searchInput = document.getElementById("catalog-search");

  Store.load()
    .then(init)
    .catch(() => {
      countEl.textContent = "";
      renderLoadError(grid);
    });

  function init({ books, categories }) {
    filterList.innerHTML = Object.keys(categories)
      .map((key) => filterItem(key, categories[key], books.filter((book) => book.category === key).length))
      .join("");

    const boxes = [...filterList.querySelectorAll("input")];

    // Opening catalog.html?category=fantasy pre-selects that category
    const preset = new URLSearchParams(location.search).get("category");
    boxes.forEach((box) => { box.checked = box.value === preset; });

    filterList.addEventListener("change", render);
    searchInput.addEventListener("input", render);
    clearBtn.addEventListener("click", () => {
      boxes.forEach((box) => { box.checked = false; });
      searchInput.value = "";
      render();
    });

    function render() {
      const active = boxes.filter((box) => box.checked).map((box) => box.value);
      const query = searchInput.value.trim().toLowerCase();
      const visible = books.filter((book) =>
        (active.length === 0 || active.includes(book.category)) &&
        (!query || `${book.title} ${book.author}`.toLowerCase().includes(query)));

      clearBtn.hidden = active.length === 0 && !query;
      countEl.innerHTML = `Showing <strong>${visible.length}</strong> of ${books.length} books`;
      grid.innerHTML = visible.length
        ? visible.map((book) => renderBookCard(book, categories)).join("")
        : '<p class="catalog__empty">No books match your filters.</p>';
      grid.classList.toggle("book-grid", visible.length > 0);
    }

    render();
  }

  function filterItem(value, label, count) {
    return `
      <li>
        <label class="filter">
          <input class="filter__input" type="checkbox" value="${value}">
          <span class="filter__box" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
          <span class="filter__label">${label}</span>
          <span class="filter__count">${count}</span>
        </label>
      </li>`;
  }
})();
