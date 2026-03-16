const fs = require('fs');

async function download() {
  const url = 'https://raw.githubusercontent.com/paraschaturvedi/car-scroll-animation/main/McLaren%20720S%202022%20top%20view.png';
  const dest = 'c:/Users/Angad/Desktop/assigment/ItzFizz/public/car.png';
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
    console.log('Successfully downloaded proper transparent car.png');
  } catch (err) {
    console.error('Download failed:', err);
  }
}

download();
