let image = document.querySelector("#image");
let slider = document.querySelector("#slider");

slider.addEventListener("input", moveImage);

function moveImage(e) {
  let value = e.target.value;
  //Mapping the width of the window by subtracting the width of the image
  image.style.left = `${(value / 100) * (window.innerWidth - image.width)}px`;

}
