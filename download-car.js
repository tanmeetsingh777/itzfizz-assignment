const fs = require('fs');
const https = require('https');

// A reliable Wikimedia Commons direct link for an orange McLaren top view
const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/2018_McLaren_720S_Coupe_V8_S-A_4.0_Top.jpg/800px-2018_McLaren_720S_Coupe_V8_S-A_4.0_Top.jpg';
const dest = 'c:/Users/Angad/Desktop/assigment/ItzFizz/public/car.jpg';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    return;
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Successfully downloaded car.jpg');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
