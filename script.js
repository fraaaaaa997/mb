(function themeToggleInit() {
  const storageKey = "mb-theme";

  function storedMode() {
    return localStorage.getItem(storageKey) === "light" ? "light" : "dark";
  }

  function applyTheme(mode) {
    const light = mode === "light";
    document.body.classList.toggle("theme-light", light);
    const logoLink = document.querySelector(".nav-brand .logo > a");
    if (!logoLink) return;
    logoLink.setAttribute(
      "aria-label",
      light ? "Passa alla modalità notte" : "Passa alla modalità giorno"
    );
    logoLink.title = light ? "Clic sul logo: modalità notte" : "Clic sul logo: modalità giorno";
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(storedMode());
    const logoLink = document.querySelector(".nav-brand .logo > a");
    if (!logoLink) return;
    logoLink.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const next = document.body.classList.contains("theme-light") ? "dark" : "light";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-story-init");

  const footer = document.querySelector("footer");
  const scrollWrapper = document.getElementById("scroll-section");
  const scrollContent = document.getElementById("scroll-content");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navBar = document.querySelector("nav");

  let isAtBottom = false;
  let lastScrollY = window.scrollY;
  const navScrollDelta = 4;
  const navShowTopPx = 56;

  function setScrollWrapperHeight() {
    if (scrollWrapper && scrollContent) {
      const totalScrollDistance = scrollContent.scrollWidth - window.innerWidth;
      const scrollHeight = (totalScrollDistance / window.innerWidth) * window.innerHeight;
      scrollWrapper.style.height = `${scrollHeight + window.innerHeight}px`;
    }
  }

  setScrollWrapperHeight();
  window.addEventListener("resize", setScrollWrapperHeight);

  let ticking = false;

  /** Full scrollable document height (body.offsetHeight stays ~100vh in Chrome when body { height:100% }). */
  function getScrollableDocumentHeight() {
    const html = document.documentElement;
    return Math.max(
      html.scrollHeight,
      html.offsetHeight,
      document.body.scrollHeight,
      document.body.offsetHeight
    );
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docScrollHeight = getScrollableDocumentHeight();

    if (navBar) {
      if (navLinks && navLinks.classList.contains("active")) {
        navBar.classList.remove("nav-hidden");
      } else if (scrollY < navShowTopPx) {
        navBar.classList.remove("nav-hidden");
      } else {
        const dy = scrollY - lastScrollY;
        if (dy > navScrollDelta) {
          navBar.classList.add("nav-hidden");
        } else if (dy < -navScrollDelta) {
          navBar.classList.remove("nav-hidden");
        }
      }
      lastScrollY = scrollY;
    }

    if (footer) {
      if (scrollY + windowHeight >= docScrollHeight - 10) {
        footer.classList.remove("hidden");
        isAtBottom = true;
      } else {
        if (scrollY > 50 && !isAtBottom) {
          footer.classList.add("hidden");
        } else if (scrollY < 50) {
          footer.classList.remove("hidden");
        }
        isAtBottom = false;
      }
    }

    if (scrollWrapper && scrollContent) {
      const sectionTop = scrollWrapper.offsetTop;
      const maxScroll = scrollWrapper.offsetHeight - window.innerHeight;
      const relativeScroll = scrollY - sectionTop;

      if (scrollY >= sectionTop && scrollY < sectionTop + maxScroll) {
        const percentage = relativeScroll / maxScroll;
        const scrollX = percentage * (scrollContent.scrollWidth - window.innerWidth);
        scrollContent.style.transform = `translateX(-${scrollX}px)`;
      } else if (scrollY < sectionTop) {
        scrollContent.style.transform = `translateX(0)`;
      } else {
        scrollContent.style.transform = `translateX(-${scrollContent.scrollWidth - window.innerWidth}px)`;
      }
    }

  }

  function toggleMenu() {
    if (navLinks && hamburger) {
      const open = navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      hamburger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      if (navLinks.classList.contains("active") && navBar) {
        navBar.classList.remove("nav-hidden");
      }
    }
  }

  function closeMenu() {
    if (!navLinks || !hamburger || !navLinks.classList.contains("active")) return;
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Apri il menu");
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", toggleMenu);
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  handleScroll();

  const allCarousels = document.querySelectorAll(".carousel-container");

  allCarousels.forEach((container) => {
    const carousel = container.querySelector(".carousel");
    const slides = container.querySelectorAll(".slide");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");

    if (!carousel || slides.length === 0 || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function updateCarousel() {
      const offset = -currentIndex * 100;
      carousel.style.transition = "transform 0.5s ease-in-out";
      carousel.style.transform = `translateX(${offset}%)`;

      slides.forEach((slide) => slide.classList.remove("active"));
      slides[currentIndex].classList.add("active");
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });

  const h5Observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("h5, #realizziamo-heading").forEach((heading) => {
    h5Observer.observe(heading);
  });

  const storyTextSections = document.querySelectorAll(".story-sequence > .story-strip--text");
  if (storyTextSections.length > 0) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      storyTextSections.forEach((el) => el.classList.add("story-strip--text-reveal"));
    } else {
      const narrowMq = window.matchMedia("(max-width: 800px)");
      function storyIoOptions() {
        return narrowMq.matches
          ? { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
          : { threshold: 0.15, rootMargin: "0px 0px -10% 0px" };
      }

      let storyTextIo = null;

      function observeStorySections() {
        if (storyTextIo) storyTextIo.disconnect();
        storyTextIo = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("story-strip--text-reveal");
              obs.unobserve(entry.target);
            }
          });
        }, storyIoOptions());
        storyTextSections.forEach((el) => storyTextIo.observe(el));
      }

      observeStorySections();

      if (typeof narrowMq.addEventListener === "function") {
        narrowMq.addEventListener("change", observeStorySections);
      } else if (typeof narrowMq.addListener === "function") {
        narrowMq.addListener(observeStorySections);
      }
    }
  }

  /**
   * Effetto macchina da scrivere (opzionale): aggiungi data-typewriter al nodo,
   * oppure usa #effect-11 .placeholder nel markup.
   */
  function typewriterEffect(element, speed = 42) {
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const text = element.textContent;
    element.textContent = "";
    let i = 0;
    function tick() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  const typewriterEl =
    document.querySelector("[data-typewriter]") || document.querySelector("#effect-11 .placeholder");
  if (typewriterEl) {
    typewriterEffect(typewriterEl);
  }

  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      body.classList.toggle("open");
      header.classList.toggle("active");
    });
  });

});
