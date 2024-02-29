const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

//dom elements
const contentX = document.getElementById("x");
const contentY = document.getElementById("y");
const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const contentGamma = document.getElementById("gamma");
const dot = document.getElementById("spotlight");
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
        // handleInserts(payload.new);
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
    let normalizedY = normalize(data.values.beta, 10, 50, 100, 0); // Invert y-axis
    let normalizedAlpha = normalizeAlpha(data.values.alpha, 200, 160, 0, 100);
  
    dot.setAttribute(
      "style",
      `left:${normalizedAlpha}%; top:${normalizedY}%;`
    );

    // while (True){
    // }

    // Check if conditions are met to show the image
    if ((data.values.beta > 0 && data.values.beta < 20) && (data.values.alpha > 200 && data.values.alpha < 220)) {
      const image1 = document.getElementById('uk');
      image1.style.display = 'block'; // Show the image

      // Hide the image after 5 seconds
      setTimeout(() => {
          uk.style.display = 'none';
      }, 5000);
    }
  
    // Update other elements as before
    contentX.innerHTML = data.values.x;
    contentY.innerHTML = data.values.y;
    contentTime.innerHTML = data.updated_at;
    contentId.innerHTML = data.id;
    contentAlpha.innerHTML = data.values.alpha;
    contentBeta.innerHTML = data.values.beta;
    contentGamma.innerHTML = data.values.gamma;
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
  