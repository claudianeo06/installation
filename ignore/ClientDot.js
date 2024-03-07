const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

const contentX = document.getElementById("x");
const contentY = document.getElementById("y");
const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const contentGamma = document.getElementById("gamma");

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

  updateDotPosition(data.values.x, data.values.y);
  updateBasedOnDot();
  adjustGalleryMargins(data);

  contentX.innerHTML = data.values.x;
  contentY.innerHTML = data.values.y;
  contentTime.innerHTML = data.updated_at;
  contentId.innerHTML = data.id;
  contentAlpha.innerHTML = data.values.alpha;
  contentBeta.innerHTML = data.values.beta;
  contentGamma.innerHTML = data.values.gamma;
}

function adjustGalleryMargins(data) {
  const gallery = document.getElementById("gallery");

  const marginLeft = mapRange(data.values.alpha, 60, 300, -50, 50);
  const marginTop = mapRange(data.values.beta, 0, 40, -5, 5);

  // Apply the calculated margins to the gallery
  gallery.style.marginLeft = `${marginLeft}vw`;
  gallery.style.marginTop = `${marginTop}vw`;
}

function mapRange(value, fromSource, toSource, fromTarget, toTarget) {
  return (
    ((value - fromSource) / (toSource - fromSource)) * (toTarget - fromTarget) +
    fromTarget
  );
}

function updateDotPosition(x, y) {
  checkOverlap(dot);
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
      block.style.opacity = 100;
    } else {
      // Remove hover effect
      block.style.zIndex = "";
      block.style.opacity = "";
    }
  });
}

function updateBasedOnDot() {
  // Extract the dot's current position
  const dotRect = dot.getBoundingClientRect();
  const dotX = dotRect.left + dotRect.width / 2,
    dotY = dotRect.top + dotRect.height / 2;

  const xDecimal = dotX / window.innerWidth,
    yDecimal = dotY / window.innerHeight;

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
    blocks = document.querySelectorAll(".block");

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
    dx = (block.cx - dotX) ** 2;
    dy = (block.cy - dotY) ** 2;
    let distance = Math.sqrt(dx + dy);

    if (distance > radius) {
      gsap.to(block, { scale: 1, ease: "power1.inOut", duration: 0.5 }); // Reset scale with animation
    } else {
      let progress = Math.max(0, 1 - distance / radius);
      block.tween.progress(progress);
    }
  }
}