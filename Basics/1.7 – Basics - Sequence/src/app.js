//01 - Mouse Hover Horizontal Move

//container
let container = document.querySelector("#container");

//select the image
let img = document.querySelector("#img");

//number of images
let numOfImages = 10;

//window size
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

//mouse position
let mouseX, mouseY;

//divide the screen
let screenSection = windowWidth / numOfImages;

//events mouse move
container.addEventListener("mousemove", mouseMoveFn, true);

function mouseMoveFn(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  const sectionNumber = findImageSection(mouseX, screenSection);
  img.src = `src/img/${sectionNumber}.png`;
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
