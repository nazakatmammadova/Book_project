// Home page: hero slider, featured books, animated stats, contact form.

(() => {
  /* ---------- Hero slider ---------- */
  const slider = document.querySelector(".hero");
  const slides = slider.querySelectorAll(".hero__slide");
  const dotsWrap = slider.querySelector(".hero__dots");
  const AUTOPLAY_MS = 6000;
  let current = 0;
  let timer = null;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero__dot";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => goTo(index));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll(".hero__dot");

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }

  slider.querySelector(".hero__arrow--prev").addEventListener("click", () => goTo(current - 1));
  slider.querySelector(".hero__arrow--next").addEventListener("click", () => goTo(current + 1));
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", restart);

  // Swipe support on touch screens
  let touchStartX = 0;
  slider.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  slider.addEventListener("touchend", (event) => {
    const diff = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) goTo(current + (diff < 0 ? 1 : -1));
  });

  goTo(0);

  /* ---------- Featured books ---------- */
  const featuredGrid = document.getElementById("featured-books");
  Store.load()
    .then(({ books, categories }) => {
      featuredGrid.innerHTML = books
        .filter((book) => book.featured)
        .map((book) => renderBookCard(book, categories))
        .join("");
    })
    .catch(() => renderLoadError(featuredGrid));

  /* ---------- Stats counters (run once when visible) ---------- */
  const counters = document.querySelectorAll("[data-count-to]");

  function animateCounter(el) {
    const target = Number(el.dataset.countTo);
    const duration = 1800;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counters.forEach((counter) => observer.observe(counter));

  /* ---------- Contact form (demo, no backend) ---------- */
  const form = document.getElementById("contact-form");
  const status = form.querySelector(".form__status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    status.textContent = `Thank you${name ? ", " + name : ""}! We'll get back to you soon.`;
    form.reset();
  });
})();
