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

        dot = document.getElementsByClassName("spotlight")[0];
        dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

        contentX.innerHTML = px;
        contentY.innerHTML = py;
        contentTime.innerHTML = new Date();
        contentId.innerHTML = id;
        contentAlpha.innerHTML = rotation_degrees;
        contentBeta.innerHTML = frontToBack_degrees;
        contentGamma.innerHTML = leftToRight_degrees;

        updateSupabase(
          px,
          py,
          rotation_degrees,
          frontToBack_degrees,
          leftToRight_degrees
        );
      });
    }
  });
}

async function updateSupabase(
  px,
  py,
  rotation_degrees,
  frontToBack_degrees,
  leftToRight_degrees
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
      },
      updated_at: new Date(),
    })
    .eq("id", id);
}