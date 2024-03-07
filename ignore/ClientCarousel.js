const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

// const contentX = document.getElementById("x");
// const contentY = document.getElementById("y");
// const contentTime = document.getElementById("time");
// const contentId = document.getElementById("id");
// const contentAlpha = document.getElementById("alpha");
// const contentBeta = document.getElementById("beta");
// const contentGamma = document.getElementById("gamma");

// const dot = document.getElementById("spotlight");
const gallery = document.getElementById("gallery");
const id = 1;
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 60; // Sensor refresh rate
let tableName = "Metacompass";

const carouselImages = {
  1: ["./src/img/denmark_1.JPG"],
  2: ["./src/img/latvia_1.jpg"],
  3: ["./src/img/lithuania_1.jpg"],
  4: [
    "./src/img/poland_1.jpg",
    "./src/img/poland_2.jpg",
    "./src/img/poland_3.jpg",
    "./src/img/poland_4.jpg",
    "./src/img/poland_5.jpg",
  ],
  5: [
    "./src/img/germany_1.jpg",
    "./src/img/germany_2.jpg",
    "./src/img/germany_3.jpg",
    "./src/img/germany_4.jpg",
  ],
  6: [
    "./src/img/netherlands_1.jpg",
    "./src/img/netherlands_2.jpg",
    "./src/img/netherlands_3.jpg",
  ],
  7: [
    "./src/img/czeck_republic_1.jpg",
    "./src/img/czeck_republic_2.jpg",
    "./src/img/czeck_republic_3.jpg",
  ],
  8: ["./src/img/ukraine_1.jpg", "./src/img/ukraine_2.jpg"],
  9: ["./src/img/france_1.jpg", "./src/img/france_2.jpg"],
  10: ["./src/img/switzerland_1.jpg"],
  11: [
    "./src/img/romania_1.jpg",
    "./src/img/romania_2.jpg",
    "./src/img/romania_3.jpg",
    "./src/img/romania_4.jpg",
  ],
  12: ["./src/img/uk_1.jpg"],
  13: [
    "./src/img/hungary_1.jpg",
    "./src/img/hungary_2.jpg",
    "./src/img/hungary_3.jpg",
    "./src/img/hungary_4.jpg",
    "./src/img/hungary_5.jpg",
    "./src/img/hungary_6.jpg",
    "./src/img/hungary_7.jpg",
    "./src/img/hungary_8.jpg",
    "./src/img/hungary_9.jpg",
  ],
  14: ["./src/img/croatia_1.jpg", "./src/img/croatia_2.jpg"],
  15: ["./src/img/serbia_1.jpg"],
  16: ["./src/img/slovenia_1.jpg", "./src/img/slovenia_2.jpg"],
};

// document.addEventListener("DOMContentLoaded", async () => {
//   //subscribe to changes in the
//   database
//     .channel(tableName)
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: tableName },
//       (payload) => {
//         handleInserts(payload.new);
//       }
//     )
//     .subscribe();

//   //select all data from sensors
//   let { data, error } = await database.from(tableName).select("*");
//   handleInserts(data[0]);
// });

function handleInserts(data) {
  console.log(data);

  // contentX.innerHTML = data.values.x;
  // contentY.innerHTML = data.values.y;
  // contentTime.innerHTML = data.updated_at;
  // contentId.innerHTML = data.id;
  // contentAlpha.innerHTML = data.values.alpha;
  // contentBeta.innerHTML = data.values.beta;
  // contentGamma.innerHTML = data.values.gamma;
}

document.addEventListener("DOMContentLoaded", () => {
  const numberOfChildBlocks = 42; // Adjust the number as needed

  for (let i = 1; i <= numberOfChildBlocks; i++) {
    ((index) => {
      const block = document.querySelector(`.block:nth-child(${index})`);
      if (block) {
        block.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent any other click handlers from being executed
          let carouselIndex;
          if (index === 1) {
            carouselIndex = 1;
          }
          if (index === 2) {
            carouselIndex = 2;
          }
          if (index === 3) {
            carouselIndex = 3;
          }
          if (
            index === 4 ||
            index === 5 ||
            index === 6 ||
            index === 7 ||
            index === 8
          ) {
            carouselIndex = 4;
          }
          if (index === 9 || index === 10 || index === 11 || index === 12) {
            carouselIndex = 5;
          }
          if (index === 13 || index === 14 || index === 15) {
            carouselIndex = 6;
          }
          if (index === 16 || index === 17 || index === 18) {
            carouselIndex = 7;
          }
          if (index === 19 || index === 20) {
            carouselIndex = 8;
          }
          if (index === 21 || index === 22) {
            carouselIndex = 9;
          }
          if (index === 23) {
            carouselIndex = 10;
          }
          if (index === 24 || index === 25 || index === 26 || index === 27) {
            carouselIndex = 11;
          }
          if (index === 28) {
            carouselIndex = 12;
          }
          if (
            index === 29 ||
            index === 30 ||
            index === 31 ||
            index === 32 ||
            index === 33 ||
            index === 34 ||
            index === 35 ||
            index === 36 ||
            index === 37
          ) {
            carouselIndex = 13;
          }
          if (index === 38 || index === 39) {
            carouselIndex = 14;
          }
          if (index === 40) {
            carouselIndex = 15;
          }
          if (index === 41 || index === 42) {
            carouselIndex = 16;
          }
          openCarousel(carouselIndex);
        });
      }
    })(i);
  }

  document.getElementById("closeOverlay").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.querySelectorAll(".carousel").forEach((carousel) => {
      carousel.style.display = "none";
    });
  });
});

function openCarousel(index) {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    carousel.style.display = "none";
  });

  const specificCarousel = document.getElementById(`carousel${index}`);

  if (specificCarousel) {
    specificCarousel.innerHTML = "";

    const imagesContainer = document.createElement("div");
    imagesContainer.classList.add("carousel-images");
    specificCarousel.appendChild(imagesContainer);

    const images = carouselImages[index] || [];
    images.forEach((src) => {
      const img = document.createElement("img");
      img.setAttribute("data-src", src);
      img.alt = "";
      imagesContainer.appendChild(img);
    });

    //Navigation buttons
    const prevButton = document.createElement("div");
    prevButton.classList.add("prev");
    prevButton.innerHTML = "&#10094;"; // Left arrow HTML entity
    prevButton.onclick = () => moveSlide(-1, index);

    const nextButton = document.createElement("div");
    nextButton.classList.add("next");
    nextButton.innerHTML = "&#10095;"; // Right arrow HTML entity
    nextButton.onclick = () => moveSlide(1, index);

    specificCarousel.appendChild(prevButton);
    specificCarousel.appendChild(nextButton);
    setupCarouselNavigation(index);

    // Show the specific carousel
    specificCarousel.style.display = "flex";
    showSlides(0, `carousel${index}`);
  }

  observeImages();
  document.getElementById("overlay").style.display = "flex";
}

// Function to observe elements
function observeImages() {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");
          img.src = src;
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the element is in the viewport
    }
  );

  document.querySelectorAll("img[data-src]").forEach((img) => {
    observer.observe(img);
  });
}

let slideIndexes = {};

function showSlides(n, carouselId) {
  let slides = document.querySelectorAll(`#${carouselId} .carousel-images img`);

  if (!(carouselId in slideIndexes)) {
    slideIndexes[carouselId] = 0;
  }

  let newSlideIndex = slideIndexes[carouselId] + n;
  if (newSlideIndex >= slides.length) {
    newSlideIndex = 0;
  } else if (newSlideIndex < 0) {
    newSlideIndex = slides.length - 1;
  }

  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  slides[newSlideIndex].style.display = "block";
  slideIndexes[carouselId] = newSlideIndex;
}

function moveSlide(n, carouselId) {
  showSlides(n, `carousel${carouselId}`);
}

function setupCarouselNavigation(index) {
  const specificCarousel = document.getElementById(`carousel${index}`);
  const scrollAmount = specificCarousel.clientWidth / 3; // Assuming 3 items visible

  const prevButton = specificCarousel.querySelector(".prev");
  const nextButton = specificCarousel.querySelector(".next");

  prevButton.addEventListener("click", () => {
      specificCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextButton.addEventListener("click", () => {
      specificCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}


//mouse event
window.onmousemove = (e) => {
  const mouseX = e.clientX,
    mouseY = e.clientY;

  const xDecimal = mouseX / window.innerWidth,
    yDecimal = mouseY / window.innerHeight;

  const maxX = gallery.offsetWidth - window.innerWidth,
    maxY = gallery.offsetHeight - window.innerHeight;

  const panX = maxX * xDecimal * -1,
    panY = maxY * yDecimal * -1;

  gallery.animate(
    {
      transform: `translate(${panX}px, ${panY}px)`,
    },
    {
      duration: 4000,
      fill: "forwards",
      easing: "ease",
    }
  );
};

const radius = 300,
  maxScale = 3,
  blocks = document.querySelectorAll(".block"),
  radius2 = radius * radius,
  container = document.querySelector("#gallery");

blocks.forEach((block) => {
  let b = block.getBoundingClientRect();
  block.cx = b.left + b.width / 2 + window.scrollX;
  block.cy = b.top + b.height / 2 + window.scrollY;

  block.tween = gsap
    .to(block, { scale: maxScale, ease: "power1.in", paused: true })
    .progress(1)
    .progress(0);

  block.addEventListener("mouseenter", () => {
    block.style.opacity = "100%";
  });

  block.addEventListener("mouseleave", () => {
    block.style.opacity = "50%";
  });
});

document.addEventListener("mousemove", (e) => {
  let i = blocks.length,
    dx,
    dy,
    block;
  while (i--) {
    block = blocks[i];
    dx = (block.cx - e.pageX) ** 2;
    dy = (block.cy - e.pageY) ** 2;
    block.tween.progress(1 - (dx + dy) / radius2);
  }
});
