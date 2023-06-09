import { writeFile } from 'fs/promises';
import { join } from 'path';
import mergeImg from 'merge-img';
import axios from 'axios';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const {
  greeting = 'Hello', who = 'You',
  width = 400, height = 500, color = 'Pink', size = 100,
} = argv;

const baseUrl = `https://cataas.com/`;
const firstReqUrl = `${baseUrl}cat/says/${greeting}?width=${width}&height=${height}&color=${color}&s=${size}`;
const secondReqUrl = `${baseUrl}cat/says/${who}?width=${width}&height=${height}&color=${color}&s=${size}`;

/**
 * Generate a cat card by merging two cat images.
 */
async function generateCatCard() {
  try {

    const [firstBody, secondBody] = await Promise.all([
      downloadCatImage(firstReqUrl),
      downloadCatImage(secondReqUrl)
    ]);

    const img = await mergeImg([
      { src: firstBody, x: 0, y: 0 },
      { src: secondBody, x: width, y: 0 }
    ]);

    const buffer = await new Promise((resolve, reject) => {
      img.getBuffer('image/jpeg', (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });

    const fileOut = join(process.cwd(), '/cat-card.jpg');

    await writeFile(fileOut, buffer, 'binary');
    console.log('The file was saved!');
  } catch (error) {
    console.error('Failed to generate the cat card:', error);
  }
}

/**
 * 
 * Download a cat image from the specified URL.
 * @param {string} url - The URL of the cat image.
 * @returns {Promise<Buffer>} The downloaded image as a Buffer.
 */
async function downloadCatImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log(`Received response with status: ${response.status}`);
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Failed to download the cat image:', error);
    throw error;
  }
}

generateCatCard();
