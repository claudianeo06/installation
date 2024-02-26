function draw(predictions) {
  console.log(predictions);
  let container = document.getElementById("container");
  let rect = document.getElementById("rect");
  let widthCanvas = document.getElementById("canvas").width;
  let heightCanvas = document.getElementById("canvas").height;
  let xFace, yFace, widthFace, heightFace;
  let widthWindow = window.innerWidth;
  let heightWindow = window.innerHeight;
  let x,y;


  if (predictions.length > 0) {
    // control if we have at least an item with label face
    let face = predictions.find((item) => item.label === "face");

    // if we have a face
    if (face) {

      // get the coordinates of the face and size
      xFace = face.bbox[0];
      yFace = face.bbox[1];
      widthFace = face.bbox[2];
      heightFace = face.bbox[3];

      // map the coordinates of the face from the canvas to the window
      x = mapRange(xFace, 0, widthCanvas, 0, widthWindow);

      //change the position of the rect and the colors
      rect.style.opacity = `1`;
      rect.style.left = `${x}px `;
      rect.style.backgroundColor = "black";
      rect.style.borderRadius = "0%";
      rect.style.width = `${mapRange(widthFace, 0, widthCanvas, 0, widthWindow)}px`;
      rect.style.height = `${mapRange(heightFace, 0, heightCanvas, 0, heightWindow)}px`;
      rect.innerHTML = `x: ${xFace} <br> y: ${yFace} <br> width: ${widthFace} <br> height: ${heightFace}`;
      
      //change the color of the container if the face is on the right or on the left
      if((xFace + (widthFace/2)) > widthCanvas/2){
        container.style.backgroundColor = "yellow";
      }
      else {
        container.style.backgroundColor = "white";
      }
        
    } 

    // if we don't have a face, we hide the rect
    else {
      rect.style.backgroundColor = "red";
      rect.style.borderRadius = "50%";
      rect.innerHTML = ``;
    }
  }
}

// map function
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
