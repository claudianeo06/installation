//dom elements
const contentX = document.getElementById("x");
const contentY = document.getElementById("y");
const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const contentGamma = document.getElementById("gamma");
const button = document.getElementById("accelPermsButton");
const value = document.getElementById("value");
const image = document.getElementById("image");

let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;

let updateRate = 1 / 60; // Sensor refresh rate

let slideIndex = 0;
let startPos = 0;
let endPos = 0;
let isDragging = false;

let lastMoveTime = 0;

let canMoveSlide = true; // Flag to control slide movement

function attemptMoveSlide(px) {
    // Check if we're allowed to move the slide
    if (!canMoveSlide) return;

    // Determine the direction based on px and ensure it's in the bounds to trigger a slide change
    if (px <= 5 || px >= 87) {
        // Move the carousel in the appropriate direction
        moveSlide(px <= 5 ? -1 : 1);

        // Prevent further moves
        canMoveSlide = false;

        // Set a timeout to re-allow movement after 3 seconds
        setTimeout(() => {
            canMoveSlide = true;
        }, 3000);
    }
}

button.addEventListener("click", () => {
  getAccel();
});

async function getAccel() {
  DeviceMotionEvent.requestPermission().then((response) => {
    if (response == "granted") {
      window.addEventListener("deviceorientation", (event) => {
        rotation_degrees = event.alpha;
        frontToBack_degrees = event.beta;
        leftToRight_degrees = event.gamma;

        vx = vx + leftToRight_degrees * updateRate * 2;
        vy = vy + frontToBack_degrees * updateRate;

        px = px + vx * 0.5;
        if (px > 92 || px < 0) {
          px = Math.max(0, Math.min(92, px)); // Clip px between 0-95
          vx = 0;
        }

        attemptMoveSlide(px);

        py = py + vy * 0.5;
        if (py > 95 || py < 0) {
          py = Math.max(0, Math.min(95, py)); // Clip py between 0-95
          vy = 0;
        }

        dot = document.getElementById("dot");
        dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

        contentX.innerHTML = px;
        contentY.innerHTML = py;
        contentAlpha.innerHTML = rotation_degrees;
        contentBeta.innerHTML = frontToBack_degrees;
        contentGamma.innerHTML = leftToRight_degrees;

        value.innerHTML = `${py} > ${window.innerHeight / 2}`;

        image.style.width = `${py / 2}%`;
      });
    }
  });
}
  

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
