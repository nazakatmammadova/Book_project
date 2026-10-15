// Shopping cart: state is kept in localStorage so it survives page changes.
// Book details (title, price, image) come from Store once books.json is loaded.

const Cart = (() => {
  const STORAGE_KEY = "skybook-cart";

  const drawer = document.getElementById("cart");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("cart-checkout");
  const countEl = document.querySelector("[data-cart-count]");

  let books = [];
  let items = []; // [{ id, qty }]

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved.filter((item) => findBook(item.id)) : [];
    } catch {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable (private mode) — the cart still works for this page.
    }
  }

  function findBook(id) {
    return books.find((book) => book.id === id);
  }

  function add(id, qty = 1) {
    const item = items.find((entry) => entry.id === id);
    if (item) {
      item.qty += qty;
    } else {
      items.push({ id, qty });
    }
    update();
    bumpCounter();
  }

  function changeQty(id, delta) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      remove(id);
      return;
    }
    update();
  }

  function remove(id) {
    items = items.filter((entry) => entry.id !== id);
    update();
  }

  function update() {
    save();
    render();
  }

  function bumpCounter() {
    countEl.classList.remove("is-bump");
    void countEl.offsetWidth; // restart the animation
    countEl.classList.add("is-bump");
  }

  function render() {
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = items.reduce((sum, item) => sum + findBook(item.id).price * item.qty, 0);

    countEl.textContent = totalQty;
    totalEl.textContent = formatPrice(totalPrice);
    checkoutBtn.disabled = items.length === 0;

    if (items.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart__empty">
          <div>
            <i class="fa-solid fa-basket-shopping" aria-hidden="true"></i>
            <p>Your cart is empty.</p>
          </div>
        </div>`;
      return;
    }

    itemsEl.innerHTML = items.map((item) => {
      const book = findBook(item.id);
      const title = escapeHtml(book.title);
      return `
        <div class="cart-item">
          <img src="${BOOK_IMAGE_PATH + book.image}" alt="">
          <div>
            <a class="cart-item__title" href="${bookUrl(book)}">${title}</a>
            <p class="cart-item__price">${formatPrice(book.price)}</p>
            <div class="qty">
              <button type="button" data-cart-dec="${book.id}" aria-label="Decrease quantity of ${title}">
                <i class="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <span>${item.qty}</span>
              <button type="button" data-cart-inc="${book.id}" aria-label="Increase quantity of ${title}">
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="cart-item__side">
            <span class="cart-item__total">${formatPrice(book.price * item.qty)}</span>
            <button type="button" class="cart-item__remove" data-cart-remove="${book.id}">Remove</button>
          </div>
        </div>`;
    }).join("");
  }

  function open() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    Layout.showOverlay(close);
    drawer.querySelector("[data-cart-close]").focus();
  }

  function close() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    Layout.hideOverlay();
  }

  // One delegated listener handles every cart-related button on the page.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    const { addToCart, cartInc, cartDec, cartRemove } = target.dataset;

    if (addToCart) {
      add(Number(addToCart));
      target.classList.add("is-added");
      setTimeout(() => target.classList.remove("is-added"), 600);
    } else if (cartInc) {
      changeQty(Number(cartInc), 1);
    } else if (cartDec) {
      changeQty(Number(cartDec), -1);
    } else if (cartRemove) {
      remove(Number(cartRemove));
    } else if (target.hasAttribute("data-cart-open")) {
      open();
    } else if (target.hasAttribute("data-cart-close")) {
      close();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    alert("Thank you for your order! (Demo — no payment is processed.)");
    items = [];
    update();
    close();
  });

  Store.load()
    .then((data) => {
      books = data.books;
      items = load();
      render();
    })
    .catch(() => {
      itemsEl.innerHTML = '<p class="cart__empty">The cart is unavailable right now.</p>';
    });

  return { add, open, close };
})();
