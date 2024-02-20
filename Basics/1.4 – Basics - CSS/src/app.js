let right = document.querySelector("#right");
right.addEventListener("click", () => {
  let currentColor = getComputedStyle(right).backgroundColor;
  if (currentColor == "rgb(0, 0, 0)") {
    right.style.background = "rgb(200,200,200)";
    right.style.transform = "translateY(50px)";
  } else {
    right.style.background = "rgb(0, 0, 0)";
    right.style.transform = "translateY(0px)";
  }
});
