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
let conditionMetTime = null; // Track when the condition was first met
let timerSet = false; // Flag to indicate if the timer has been set

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

  showImagesForConditions(
    ["germany1", "germany2", "germany3", "germany4"],
    33,
    36,
    183,
    185,
    5000,
    data.values.beta,
    data.values.alpha
  );

  showImagesForConditions(
    ["uk"],
    37,
    38,
    191,
    192,
    5000,
    data.values.beta,
    data.values.alpha
  );

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

function showImagesForConditions(
  imageIds,
  betaMin,
  betaMax,
  alphaMin,
  alphaMax,
  duration,
  beta,
  alpha
) {
  if (!allowUpdates) return;

  // Check conditions
  if (
    beta > betaMin &&
    beta < betaMax &&
    alpha > alphaMin &&
    alpha < alphaMax
  ) {
    // Condition just met, start or note the timer if not already done
    if (!conditionMetTime) {
      conditionMetTime = Date.now();
    }

    // Set a timer if not already set
    if (!timerSet) {
      timerSet = true;
      setTimeout(() => {
        // Check if the condition has continuously been met for at least 2 seconds
        if (Date.now() - conditionMetTime >= 2000) {
          // Show overlay
          const overlay = document.getElementById("overlay");
          if (overlay) overlay.style.display = "block";

          // Show images
          let imagesShown = 0; // Track the number of images shown
          imageIds.forEach((imageId) => {
            const image = document.getElementById(imageId);
            if (image) {
              image.style.display = "block";
              imagesShown++;
            }
          });

          // If no images were shown, don't proceed further
          if (imagesShown === 0) {
            if (overlay) overlay.style.display = "none";
            return;
          }

          // Temporarily disallow updates
          allowUpdates = false;

          // Hide images and overlay after the specified duration
          setTimeout(() => {
            console.log(
              "Timeout callback executed, resetting allowUpdates and hiding images."
            );
            imageIds.forEach((imageId) => {
              const image = document.getElementById(imageId);
              if (image) image.style.display = "none";
            });
            if (overlay) overlay.style.display = "none";
            allowUpdates = true; // Re-allow updates
          }, duration);
        }

        // Reset timer flags
        timerSet = false;
        conditionMetTime = null;
      }, 2000); // Wait for 2 seconds to verify continuous condition
    }
  } else {
    // Reset condition met time if conditions are not met
    conditionMetTime = null;
    timerSet = false; // Cancel any pending timer if conditions are no longer met
  }
}
