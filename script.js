document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer");
  const scrollWrapper = document.getElementById("scroll-section");
  const scrollContent = document.getElementById("scroll-content");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

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

  // --- Gestione dello scroll ---
  window.addEventListener("scroll", () => {
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

    // --- Scroll orizzontale ---
    if (scrollWrapper && scrollContent) {
      const wrapperTop = scrollWrapper.offsetTop;
      const relativeScroll = scrollY - wrapperTop;
      const maxScroll = scrollWrapper.offsetHeight - window.innerHeight;

      if (scrollY >= wrapperTop && scrollY < wrapperTop + maxScroll) {
        const percentage = relativeScroll / maxScroll;
        const scrollX = percentage * (scrollContent.scrollWidth - window.innerWidth);
        scrollContent.style.transform = `translateX(-${scrollX}px)`;
      }
    }
  });

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
});


// PULSNTE PER TORNARE IN CIMA
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function () {
    if (window.scrollY > window.innerHeight) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });


// EFFETTO
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible'); // opzionale: per farla sparire quando esce
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});


// H5

const h5Observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Aggiungi la classe 'visible' quando l'elemento entra nella viewport
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.5 }); // Attiviamo quando il 50% dell'elemento è visibile

// Selezioniamo tutti gli h5 e li osserviamo
document.querySelectorAll('h5').forEach(h5 => {
  h5Observer.observe(h5);
});
