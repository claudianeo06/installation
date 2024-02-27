let slideIndex = 0;
let startPos = 0;
let endPos = 0;
let isDragging = false;

function showSlides(n) {
  let slides = document.querySelectorAll('.carousel-images img');
  if (n >= slides.length) {slideIndex = 0;}
  if (n < 0) {slideIndex = slides.length - 1;}
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[slideIndex].style.display = "block";  
}

function moveSlide(n) {
  showSlides(slideIndex += n);
}

// Initialize the carousel
showSlides(slideIndex);

// Add event listeners for dragging
const carousel = document.querySelector('.carousel-images');
carousel.addEventListener('mousedown', startDragging);
carousel.addEventListener('mouseup', endDragging);
carousel.addEventListener('mouseleave', endDragging);
carousel.addEventListener('mousemove', drag);

function startDragging(e) {
  isDragging = true;
  startPos = e.clientX;
}

function endDragging(e) {
  if (!isDragging) return;
  isDragging = false;
  if (endPos - startPos > 100) {
    // Dragged right
    moveSlide(-1);
  } else if (startPos - endPos > 100) {
    // Dragged left
    moveSlide(1);
  }
}

function drag(e) {
  if (!isDragging) return;
  endPos = e.clientX;
}
