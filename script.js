// Prendi tutte le slide e i controlli
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.carousel-controls .prev');
const nextButton = document.querySelector('.carousel-controls .next');

// Imposta la slide attiva iniziale
let currentSlide = 0;
slides[currentSlide].classList.add('active');

// Funzione per cambiare la slide
function changeSlide(direction) {
  // Rimuovi la classe "active" dalla slide corrente
  slides[currentSlide].classList.remove('active');

  // Calcola il nuovo indice della slide
  if (direction === 'next') {
    currentSlide = (currentSlide + 1) % slides.length;  // Avanza alla prossima slide, ritorna alla prima quando arriva alla fine
  } else if (direction === 'prev') {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;  // Torna alla slide precedente, ritorna all'ultima quando arriva all'inizio
  }

  // Aggiungi la classe "active" alla nuova slide
  slides[currentSlide].classList.add('active');
}

// Aggiungi gli event listener per i pulsanti
prevButton.addEventListener('click', () => changeSlide('prev'));
nextButton.addEventListener('click', () => changeSlide('next'));

// aaaaaa

document.addEventListener("DOMContentLoaded", function() {
    const prevButton = document.querySelector(".custom-prev");
    const nextButton = document.querySelector(".custom-next");
    const slides = document.querySelectorAll(".custom-slide");
    let currentSlideIndex = 0;
  
    function showSlide(index) {
      // Nascondi tutte le slide
      slides.forEach(slide => slide.classList.remove("active"));
      
      // Mostra la slide corrente
      slides[index].classList.add("active");
    }
  
    // Funzione per andare alla slide precedente
    prevButton.addEventListener("click", function() {
      currentSlideIndex = (currentSlideIndex === 0) ? slides.length - 1 : currentSlideIndex - 1;
      showSlide(currentSlideIndex);
    });
  
    // Funzione per andare alla slide successiva
    nextButton.addEventListener("click", function() {
      currentSlideIndex = (currentSlideIndex === slides.length - 1) ? 0 : currentSlideIndex + 1;
      showSlide(currentSlideIndex);
    });
  });

  

  document.addEventListener('DOMContentLoaded', () => {
    // Trova tutti i caroselli nella pagina
    const carousels = document.querySelectorAll('.custom-carousel-container');

    carousels.forEach(container => {
      const slides = container.querySelectorAll('.custom-slide');
      const prevBtn = container.querySelector('.custom-prev');
      const nextBtn = container.querySelector('.custom-next');
      let currentIndex = 0;

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
      }

      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });

      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });

      // Mostra il primo slide all'inizio
      showSlide(currentIndex);
    });
  });



  