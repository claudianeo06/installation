const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const dot = document.getElementById("spotlight");
const id = 1;
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 60; // Sensor refresh rate
let tableName = "Metacompass";
let allowUpdates = true;

document.addEventListener("DOMContentLoaded", async () => {
  //subscribe to changes in the
  database
    .channel(tableName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableName },
      (payload) => {
        if (allowUpdates) {
          handleInserts(payload.new);
        }
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
  let normalizedY = normalize(data.values.beta, 10, 50, 100, 0); // Invert y-axis
  let normalizedAlpha = normalizeAlpha(data.values.alpha, 200, 160, 0, 100);
  dot.setAttribute("style", `left:${normalizedAlpha}%; top:${normalizedY}%;`);

  showImageForCondition(
    "uk",
    0,
    20,
    200,
    220,
    5000,
    data.values.beta,
    data.values.alpha
  ); // For image_1
  showImageForCondition(
    "germany",
    0,
    20,
    180,
    200,
    5000,
    data.values.beta,
    data.values.alpha
  ); // For image_2
  // Add more calls as needed for different images and conditions

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

function showImageForCondition(
  imageId,
  betaMin,
  betaMax,
  alphaMin,
  alphaMax,
  duration,
  beta,
  alpha
) {
  if (!allowUpdates) return;
  // Check if conditions are met to show the image
  if (
    beta > betaMin &&
    beta < betaMax &&
    alpha > alphaMin &&
    alpha < alphaMax
  ) {
    const overlay = document.querySelector(".overlay_image");
    const image = document.getElementById(imageId);

    overlay.style.display = "block"; // Show the overlay
    image.style.display = "block"; // Show the image

    // Temporarily disallow updates
    allowUpdates = false;

    // Hide the image and overlay after specified duration
    setTimeout(() => {
      overlay.style.display = "none"; // Hide the overlay
      image.style.display = "none"; // Hide the image
      allowUpdates = true; // Re-allow updates after the timeout
    }, duration);
  }
}
