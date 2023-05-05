let capture;
let blurAmount = 10;
let auraImage 
let z;
let c;
let video;
function preload(){
  auraImage = loadImage('aura.png');
}


function setup() {
  
    frameRate(0.8);

  
  createCanvas(400, 280);
  pixelDensity(1);
  const aspectRatio = 3/4; // width / height of video
  const captureHeight = width * aspectRatio;
  capture = createCapture(VIDEO);
  //capture.size(width,captureHeight);
  capture.size(width,300);
  capture.hide();
    getCameraAccess();
}

function draw() {
  
  
  
  // background(0);
  image(capture, 0, 0, width, height);
  capture.loadPixels();
  const blurPixels = applyBlurFilter(capture.pixels, width, height, blurAmount);
  updatePixels();
  image(blurPixels, 0, 0, width, height);
  z = random(180,350);
  c = random(10,230)
  image(auraImage,z,c);
  auraImage.resize(70,70);
}

function getCameraAccess() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.error("Could not get camera access: " + err);
    });
}


function applyBlurFilter(pixels, w, h, amount) {
  const radius = floor(amount / 2);
  const diameter = radius * 2 + 1;
  const matrix = [];
  const sum = diameter * diameter;
  for (let i = 0; i < diameter; i++) {
    matrix[i] = [];
    for (let j = 0; j < diameter; j++) {
      matrix[i][j] = 1 / sum;
    }
  }
  const resultPixels = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const x = (i / 4) % w;
    const y = floor((i / 4) / w);
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < diameter; i++) {
      for (let j = 0; j < diameter; j++) {
        const offsetX = i - radius;
        const offsetY = j - radius;
        const pixelIndex = ((y + offsetY) * w + (x + offsetX)) * 4;
        const weight = matrix[i][j];
        r += pixels[pixelIndex] * weight;
        g += pixels[pixelIndex + 1] * weight;
        b += pixels[pixelIndex + 2] * weight;
      }
    }
    resultPixels[i] = r;
    resultPixels[i + 1] = g;
    resultPixels[i + 2] = b;
    resultPixels[i + 3] = pixels[i + 3];
  }
  const resultImage = createImage(w, h);
  resultImage.loadPixels();
  for (let i = 0; i < resultPixels.length; i++) {
    resultImage.pixels[i] = resultPixels[i];
  }
  resultImage.updatePixels();
  return resultImage;
}