// Shared page chrome: header, mobile menu, overlay, footer year.

const Layout = (() => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("main-nav");
  const menuToggle = document.querySelector("[data-menu-open]");
  const overlay = document.querySelector(".overlay");

  let onOverlayClose = null;

  function showOverlay(onClose) {
    onOverlayClose = onClose;
    overlay.classList.add("is-visible");
    document.body.classList.add("is-locked");
  }

  function hideOverlay() {
    onOverlayClose = null;
    overlay.classList.remove("is-visible");
    document.body.classList.remove("is-locked");
  }

  function openMenu() {
    nav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    showOverlay(closeMenu);
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    hideOverlay();
  }

  menuToggle.addEventListener("click", openMenu);
  nav.querySelector("[data-menu-close]").addEventListener("click", closeMenu);
  nav.querySelectorAll(".nav__link").forEach((link) => link.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) closeMenu();
  }));

  overlay.addEventListener("click", () => onOverlayClose && onOverlayClose());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && onOverlayClose) onOverlayClose();
  });

  // Header shadow once the page is scrolled
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  return { showOverlay, hideOverlay };
})();
