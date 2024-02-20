//04 - Mouse Hover Verrtical Move and display none

//container
let container = document.querySelector("#container");

//img
let img = document.querySelector("#img");

let numOfImages = 10;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let mouseX, mouseY;

//divide the screen
let screenSection = windowWidth / numOfImages;

//events
container.addEventListener("mousemove", mouseMoveFn, true);

function mouseMoveFn(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  //hide all the images and show element image with the same section number
  document.querySelectorAll('img').forEach((image) => {
    image.style.display = "none";
  });

  const sectionNumber = findImageSection(mouseX, screenSection);
  document.querySelector(`#img${sectionNumber}`).style.display = "block";

}

//this function will find the section of the image
function findImageSection(mouseX, screenSection, section = 1) {
  // Check if we are in the first section
  if (section === 1 && mouseX < screenSection) {
    return section;
  }
  // Check if we are in the current section
  else if (mouseX < screenSection * section) {
    return section;
  }
  // Otherwise, move to the next section
  else {
    if (section === numOfImages) {
      return section;
    }
    return findImageSection(mouseX, screenSection, section + 1);
  }
}
