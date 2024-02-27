const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bGdtbnhlb2hyc2l3a2hxamhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4Nzk3NzcsImV4cCI6MjAyMjQ1NTc3N30.Z-F8w3dOtmnUXBtCBx07qw7AY86WCZzk7hFsKVeJejk";
const url = "https://gulgmnxeohrsiwkhqjhr.supabase.co";
const database = supabase.createClient(url, key);

//dom elements
const distance = document.getElementById("distance");
const rotation = document.getElementById("rotation");
const tableName = "touch";

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

  //select all data from touch
  let { data, error } = await database.from(tableName).select("*");
  handleInserts(data[0]);
});

function handleInserts(data) {
  distance.innerHTML = data.values.distance;
  rotation.innerHTML = data.values.rotation;
  const rect = document.getElementById("rect");
  rect.style.width = data.values.distance + "px";
  rect.style.transform = `rotate(${data.values.rotation}deg)`;
}
