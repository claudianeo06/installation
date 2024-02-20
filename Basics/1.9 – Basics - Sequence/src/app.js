//03 - Mouse Hover Verrtical Move  + Scale

//container
let container = document.querySelector("#container");

//img
let img = document.querySelector("#img");

let numOfImages = 7;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let mouseX, mouseY;

//divide the screen
let screenSection = windowHeight / numOfImages;

//events
container.addEventListener("mousemove", mouseMoveFn, true);

function mouseMoveFn(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  const sectionNumber = findImageSection(mouseY, screenSection);
  img.src = `src/img/${sectionNumber}.png`;
  img.style.transform = `scale(${sectionNumber / 2})`;
}

//this function will find the section of the image
function findImageSection(mouseY, screenSection, section = 1) {
  // Check if we are in the first section
  if (section === 1 && mouseY < screenSection) {
    return section;
  }
  // Check if we are in the current section
  else if (mouseY < screenSection * section) {
    return section;
  }
  // Otherwise, move to the next section
  else {
    if (section === numOfImages) {
      return section;
    }
    return findImageSection(mouseY, screenSection, section + 1);
  }
}
