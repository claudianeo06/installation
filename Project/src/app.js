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
const contentgetInfo = document.getElementById("button1");
const contentgoBack = document.getElementById("button2");
const id = 1;
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let bp1 = 0;
let bp2 = 0;
let updateRate = 1 / 60; // Sensor refresh rate
let tableName = "Metacompass";

let b1pressed = false;
let b2pressed = false;

document.addEventListener("DOMContentLoaded", async () => {
  //subscribe to changes in the
  database
    .channel(tableName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableName },
      (payload) => {
        // handleInserts(payload.new);
        console.log(payload.new);
      }
    )
    .subscribe();

  //select all data from sensors
  let { data, error } = await database.from(tableName).select("*");
  console.log(data[0]);

  //send the first data to the dom
  handleInserts(data[0]);
});

async function getAccel() {
  DeviceMotionEvent.requestPermission().then((response) => {
    if (response == "granted") {
      // Add a listener to get smartphone orientation
      // in the alpha-beta-gamma axes (units in degrees)

      // Remove the button after setting up the event listener
      document.getElementById("accelPermsButton").remove();

      // Add this line to make the text appear
      document.getElementById("instructions").style.display = "block";
      document.getElementById("newButtonId").style.display = "block";

      window.addEventListener("deviceorientation", (event) => {
        // Expose each orientation angle in a more readable way
        rotation_degrees = event.alpha;
        frontToBack_degrees = event.beta;
        leftToRight_degrees = event.gamma;

        // Update velocity according to how tilted the phone is
        // Since phones are narrower than they are long, double the increase to the x velocity
        vx = vx + leftToRight_degrees * updateRate * 2;
        vy = vy + frontToBack_degrees * updateRate;

        // Update position and clip it to bounds
        px = px + vx * 0.5;
        if (px > 98 || px < 0) {
          px = Math.max(0, Math.min(98, px)); // Clip px between 0-98
          vx = 0;
        }

        py = py + vy * 0.5;
        if (py > 98 || py < 0) {
          py = Math.max(0, Math.min(98, py)); // Clip py between 0-98
          vy = 0;
        }

        if (b1pressed) {
          bp1 = 1;
          bp2 = 0;
        }
        if (b2pressed) {
          bp1 = 0;
          bp2 = 1;
        }

        //dot = document.getElementsByClassName("dot")[0];
        //dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

        contentX.innerHTML = px;
        contentY.innerHTML = py;
        contentTime.innerHTML = new Date();
        contentId.innerHTML = id;
        contentAlpha.innerHTML = rotation_degrees;
        contentBeta.innerHTML = frontToBack_degrees;
        contentGamma.innerHTML = leftToRight_degrees;
        contentgetInfo.innerHTML = bp1;
        contentgoBack.innerHTML = bp2;

        updateSupabase(
          px,
          py,
          rotation_degrees,
          frontToBack_degrees,
          leftToRight_degrees,
          bp1,
          bp2
        );

        // ------- movement of the indicator
        var rotation_degrees = event.alpha; // Alpha value for rotation

        // Select the line element
        var indicator = document.getElementById("indicator");

        // Apply rotation transformation with transform-origin at the bottom
        indicator.style.transform = `rotate(${rotation_degrees}deg)`;

        // Update other content as before
        //contentAlpha.innerHTML = rotation_degrees;

        //-------------------------------------------------

        // ------- movement of the cross

        const beta = event.beta; // Front-to-back tilt

        // Assuming the full movement range of the cross is 100px for simplicity
        // This value should be adjusted based on the actual size of your compass
        const maxMovement = 50; // Max movement up or down from the center

        // Normalize beta value to range from -90 to 90
        // Clamp beta to prevent extreme values from moving the cross outside the compass
        const clampedBeta = Math.max(-90, Math.min(90, beta));

        // Map the beta value to the movement range
        // Mapping -90...90 to -maxMovement...maxMovement
        const movement = (clampedBeta / 90) * maxMovement;

        // Select the cross element
        const cross = document.querySelector(".cross");

        // Adjust the cross position vertically based on the beta value
        // Moving up (-) or down (+) within the compass element
        // Initial position of cross should be vertically centered
        cross.style.transform = `translateY(${movement}px)`;
      });
    }
  });
}

function getInfo() {
  b1pressed = true;
  b2pressed = false;
  // Remove the button after setting up the event listener
  document.getElementById("newButtonId").style.display = "none"; // Hide instead of removing to potentially reuse
  document.getElementById("instructions").style.display = "none"; // Hide instructions

  document.getElementById("goBackButton").style.display = "block";
  document.getElementById("France").style.display = "block"; // Show metadata

  let smallfont = document.getElementById("Header1");
  smallfont.style.fontSize = "15px";
}

function goBack() {
  b1pressed = false;
  b2pressed = true;
  document.getElementById("goBackButton").style.display = "none";
  document.getElementById("France").style.display = "none";

  document.getElementById("newButtonId").style.display = "block"; // Hide instead of removing to potentially reuse
  document.getElementById("instructions").style.display = "block"; // Hide instructions

  let smallfont = document.getElementById("Header1");
  smallfont.style.fontSize = "24px";
}

async function updateSupabase(
  px,
  py,
  rotation_degrees,
  frontToBack_degrees,
  leftToRight_degrees,
  bp1,
  bp2
) {
  let res = await database
    .from(tableName)
    .update({
      values: {
        x: px,
        y: py,
        alpha: rotation_degrees,
        beta: frontToBack_degrees,
        gamma: leftToRight_degrees,
        button1: bp1,
        button2: bp2,
      },
      updated_at: new Date(),
    })
    .eq("id", id);
}
