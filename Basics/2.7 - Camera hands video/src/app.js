//two open hand

let video = document.getElementById("movie");

function draw(predictions) {
  let container = document.getElementById("container");
  let sound = document.getElementById("movie");
  let rect = document.getElementById("rect");
  let widthCanvas = document.getElementById("canvas").width;
  let heightCanvas = document.getElementById("canvas").height;
  let widthWindow = window.innerWidth;
  let heightWindow = window.innerHeight;


  // if we have a prediction
  if (predictions.length > 0) {
    //control if we have at least two item with label open
    let hand = predictions.filter((item) => item.label === "open");
    if(hand.length >= 2){
      video.play();
    }
    else {
      video.pause();
    }
  }
}

video.addEventListener("click", () => {
  video.muted = !video.muted;
});

// map function
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
