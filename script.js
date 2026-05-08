document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.setProperty("--vh-stable", `${window.innerHeight}px`);
});

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
  const storyHorizontalScrollMaxPx = 1024;

  function setScrollWrapperHeight() {
    if (!scrollWrapper || !scrollContent) return;

    if (window.innerWidth <= storyHorizontalScrollMaxPx) {
      scrollWrapper.style.height = "";
      scrollContent.style.transform = "";
      return;
    }

    const totalScrollDistance = scrollContent.scrollWidth - window.innerWidth;
    const scrollHeight = (totalScrollDistance / window.innerWidth) * window.innerHeight;
    scrollWrapper.style.height = `${scrollHeight + window.innerHeight}px`;
  }

  setScrollWrapperHeight();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setScrollWrapperHeight, 150);
  });

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
      if (window.innerWidth <= storyHorizontalScrollMaxPx) {
        scrollContent.style.transform = "";
      } else {
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

  const realizCardNodes = Array.from(document.querySelectorAll(".realizziamo-card"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const realizGalleryItems = [
    { src: "https://www.meccanicaberluti.it/temp/image/DSCF0003_.JPG", alt: "Particolare meccanico a disegno", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/DSCF0053.JPG", alt: "Lavorazione meccanica su tornio", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/image/03122008505.jpg", alt: "Gruppo meccanico assemblato", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/image/DSCF0003.JPG", alt: "Dettaglio particolare a disegno", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/image/premont.jpg", alt: "Premontaggio particolari a disegno", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/image/php2XxZbLAM.jpg", alt: "Particolare saldato e assemblato", caption: "Particolari a disegno" },
    { src: "https://www.meccanicaberluti.it/temp/image/phpCtcn8mAM.jpg", alt: "Bocchettone scarico rapido serbatoio Ducati", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/piastre.jpg", alt: "Piastra attacco forcelle a disegno", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/ROBBYMOTO_TappoRacing.jpg", alt: "Tappo serbatoio racing", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/Ale.jpg", alt: "Raiser personalizzati a disegno", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/copmont.JPG", alt: "Coperchio pompa frizione personalizzato", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/innesto%20tubo%20pompa%20freno%20posteriore.jpg", alt: "Innesto tubo pompa freno posteriore", caption: "Personalizzazioni" },
    { src: "https://www.meccanicaberluti.it/temp/image/phpoIrOJeAM.jpg", alt: "Prototipo meccanico", caption: "Prototipi" },
    { src: "https://www.meccanicaberluti.it/temp/image/testa.JPG", alt: "Testa per macchina foratrice da legno", caption: "Ricambistica" },
    { src: "https://www.meccanicaberluti.it/temp/image/cambioestaibile.jpg", alt: "Coperchio cambio estraibile team MotoGP", caption: "Ricambistica" }
  ];

  if (realizCardNodes.length === 8 && realizGalleryItems.length >= 8) {
    const slotCount = realizCardNodes.length;
    const poolSize = realizGalleryItems.length;
    let currentIndices = [];

    function pickUniqueSet(previous = []) {
      const allIndices = Array.from({ length: poolSize }, (_, i) => i);

      for (let i = allIndices.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = allIndices[i];
        allIndices[i] = allIndices[j];
        allIndices[j] = temp;
      }

      let next = allIndices.slice(0, slotCount);

      if (previous.length === slotCount && poolSize > slotCount) {
        const overlap = next.filter((idx) => previous.includes(idx)).length;
        if (overlap === slotCount) {
          next = allIndices.slice(1, slotCount + 1);
        }
      }

      return next;
    }

    function applyIndices(indices) {
      const seen = new Set();
      realizCardNodes.forEach((card, slot) => {
        let index = indices[slot];
        if (seen.has(index)) {
          index = Array.from({ length: poolSize }, (_, i) => i).find((candidate) => !seen.has(candidate));
        }
        seen.add(index);
        const image = card.querySelector(".realizziamo-card__image");
        const caption = card.querySelector(".realizziamo-card__caption");
        if (!image || !caption) return;
        const item = realizGalleryItems[index];
        image.src = item.src;
        image.alt = item.alt;
        caption.textContent = item.caption;
      });
    }

    function rotateAllCards() {
      const nextIndices = pickUniqueSet(currentIndices);

      if (prefersReducedMotion) {
        applyIndices(nextIndices);
        currentIndices = nextIndices;
        return;
      }

      realizCardNodes.forEach((card) => card.classList.add("is-fading"));
      window.setTimeout(() => {
        applyIndices(nextIndices);
        currentIndices = nextIndices;
        realizCardNodes.forEach((card) => card.classList.remove("is-fading"));
      }, 320);
    }

    currentIndices = pickUniqueSet();
    applyIndices(currentIndices);
    window.setInterval(rotateAllCards, 3600);
  }

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
  const prefersReducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storyMotionDesktopMq = window.matchMedia("(min-width: 1025px)");

  let storyTextIo = null;

  function syncStoryScrollReveal() {
    if (!storyTextSections.length) return;

    if (storyTextIo) {
      storyTextIo.disconnect();
      storyTextIo = null;
    }

    const useAnimatedReveal =
      storyMotionDesktopMq.matches && !prefersReducedMotionMq.matches;

    if (!useAnimatedReveal) {
      storyTextSections.forEach((el) => el.classList.add("story-strip--text-reveal"));
      return;
    }

    storyTextSections.forEach((el) => el.classList.remove("story-strip--text-reveal"));

    storyTextIo = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("story-strip--text-reveal");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    storyTextSections.forEach((el) => storyTextIo.observe(el));
  }

  syncStoryScrollReveal();

  if (typeof storyMotionDesktopMq.addEventListener === "function") {
    storyMotionDesktopMq.addEventListener("change", syncStoryScrollReveal);
  } else if (typeof storyMotionDesktopMq.addListener === "function") {
    storyMotionDesktopMq.addListener(syncStoryScrollReveal);
  }

  if (typeof prefersReducedMotionMq.addEventListener === "function") {
    prefersReducedMotionMq.addEventListener("change", syncStoryScrollReveal);
  } else if (typeof prefersReducedMotionMq.addListener === "function") {
    prefersReducedMotionMq.addListener(syncStoryScrollReveal);
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
