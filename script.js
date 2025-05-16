document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  const scrollWrapper = document.getElementById("scroll-section");
  const scrollContent = document.getElementById("scroll-content");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  let isAtBottom = false;

  // --- Imposta altezza dinamica per la sezione orizzontale ---
  function setScrollWrapperHeight() {
    if (scrollWrapper && scrollContent) {
      const totalScrollDistance = scrollContent.scrollWidth - window.innerWidth;
      const scrollHeight = (totalScrollDistance / window.innerWidth) * window.innerHeight;
      scrollWrapper.style.height = `${scrollHeight + window.innerHeight}px`;
    }
  }

  setScrollWrapperHeight();
  window.addEventListener("resize", setScrollWrapperHeight);

  // --- Scroll fluido con requestAnimationFrame ---
  let ticking = false;

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
    const bodyHeight = document.body.offsetHeight;

    // --- Mostra/nascondi il footer ---
    if (footer) {
      if (scrollY + windowHeight >= bodyHeight - 10) {
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

    // --- Scroll orizzontale nella sezione (metodo che funziona) ---
    if (scrollWrapper && scrollContent) {
      const sectionTop = scrollWrapper.offsetTop;
      const scrollY = window.scrollY;
      const relativeScroll = scrollY - sectionTop;
      const maxScroll = scrollWrapper.offsetHeight - window.innerHeight;

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

    // --- Pulsante scroll to top visibilità ---
    if (scrollTopBtn) {
      if (scrollY > window.innerHeight) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }
  }

  // --- Menu mobile toggle ---
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // --- Caroselli multipli ---
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

  // --- Pulsante scroll to top click ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- Intersection Observer per animazioni in entrata delle sezioni ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // opzionale: per far sparire quando esce
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });

  // --- Intersection Observer per h5 ---
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

  document.querySelectorAll("h5").forEach((h5) => {
    h5Observer.observe(h5);
  });

  // --- Accordion per parco macchine ---
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      body.classList.toggle("open");
      header.classList.toggle("active");
    });
  });
});
