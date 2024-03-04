const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const dot = document.getElementById("spotlight");
const gallery = document.getElementById("gallery");
const id = 1;
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 60; // Sensor refresh rate
let tableName = "Metacompass";

document.addEventListener("DOMContentLoaded", async () => {
  //subscribe to changes in the
  database
    .channel(tableName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableName },
      (payload) => {
        handleInserts(payload.new);
      }
    )
    .subscribe();

  //select all data from sensors
  let { data, error } = await database.from(tableName).select("*");
  handleInserts(data[0]);
});

function handleInserts(data) {
  console.log(data);

  // Assuming your container is 100x100 units
  let normalizedBeta = normalize(data.values.beta, 0, 40, 30, -70); // Invert y-axis
  let normalizedAlpha = normalizeAlpha(data.values.alpha, 200, 140, 0, 100);

  dot.setAttribute(
    "style",
    `left:${normalizedAlpha}%; top:${normalizedBeta}%;`
  );

  updateDotPosition(data.values.alpha, data.values.beta);
  updateBasedOnDot();

  contentTime.innerHTML = data.updated_at;
  contentId.innerHTML = data.id;
  contentAlpha.innerHTML = data.values.alpha;
  contentBeta.innerHTML = data.values.beta;
}

function normalize(value, min, max, newMin, newMax) {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}

function normalizeAlpha(alpha, minAlpha, maxAlpha, newMin, newMax) {
  // Normalize alpha within its range, considering the circular nature (140 to 220)
  if (alpha > 180) {
    // Map from 180 to 220 to the right half
    return normalize(alpha, 180, maxAlpha, (newMax - newMin) / 2, newMax);
  } else {
    // Map from 140 to 180 to the left half
    return normalize(alpha, minAlpha, 180, newMin, (newMax - newMin) / 2);
  }
}

function checkOverlap(dot) {
  const dotRect = dot.getBoundingClientRect();
  const blocks = document.querySelectorAll(".block");

  blocks.forEach((block) => {
    const blockRect = block.getBoundingClientRect();
    const overlaps = !(
      blockRect.right < dotRect.left ||
      blockRect.left > dotRect.right ||
      blockRect.bottom < dotRect.top ||
      blockRect.top > dotRect.bottom
    );

    if (overlaps) {
      // Apply hover effect
      block.style.zIndex = 2;
    } else {
      // Remove hover effect
      block.style.zIndex = ""; // Or any default z-index value
    }
  });
}

function updateDotPosition(alpha, beta) {
  checkOverlap(dot);
}

function updateBasedOnDot() {
  // Extract the dot's current position
  const dotRect = dot.getBoundingClientRect();
  const mouseX = dotRect.left + dotRect.width / 2,
    mouseY = dotRect.top + dotRect.height / 2;

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

  const radius = 300,
    maxScale = 3,
    blocks = document.querySelectorAll(".block"),
    radius2 = radius * radius,
    container = document.querySelector("#gallery");

  blocks.forEach((block) => {
    let b = block.getBoundingClientRect();
    (block.cx = b.left + b.width / 2 + window.scrollX),
      (block.cy = b.top + b.height / 2 + window.scrollY);

    block.tween = gsap
      .to(block, { scale: maxScale, ease: "power1.in", paused: true })
      .progress(1)
      .progress(0);
  });

  let i = blocks.length,
    dx,
    dy,
    block;
  while (i--) {
    block = blocks[i];
    dx = (block.cx - mouseX) ** 2;
    dy = (block.cy - mouseY) ** 2;
    block.tween.progress(1 - (dx + dy) / radius2);
  }
}

// mouse event

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
  (block.cx = b.left + b.width / 2 + window.scrollX),
    (block.cy = b.top + b.height / 2 + window.scrollY);

  block.tween = gsap
    .to(block, { scale: maxScale, ease: "power1.in", paused: true })
    .progress(1)
    .progress(0);
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
