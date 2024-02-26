let circle = document.querySelector("#circle");
let slider = document.querySelector("#slider");

slider.addEventListener("input", changeCircleSize);
window.addEventListener("mousemove", changeRotation);

function changeCircleSize(e) {
  //change the size of the circle based on the slider value
  circle.style.width = `${e.target.value}px`;
  circle.style.height = `${e.target.value}px`;
}

function changeRotation(e) {
  //rotate the circle based on the mouse position pointer  360 degrees mapping to the width of the window
  circle.style.transform = `rotate(${(e.clientX / window.innerWidth) * 360}deg)`;
}
