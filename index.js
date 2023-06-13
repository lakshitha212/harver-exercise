import { promises as fsPromises } from 'fs';
import { join } from 'path';
import mergeImg from 'merge-img';
import minimist from 'minimist';
import { promisify } from 'util';

import { downloadCatImage, getBufferAsync } from "./misc/util.js";

const argv = minimist(process.argv.slice(2));
const writeFileAsync = promisify(fsPromises.writeFile);

// Configuration options
const {
  greeting = 'Hello',
  who = 'You',
  width = 400,
  height = 500,
  color = 'Pink',
  size = 100,
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

    const img = await mergeCatImages(firstBody, secondBody);

    const buffer = await getBufferAsync(img);

    const fileOut = join(process.cwd(), '/cat-card.jpg');
    await writeFileAsync(fileOut, buffer, 'binary');
    console.log('The file was saved!');
  } catch (error) {
    console.error('Failed to generate the cat card:', error);
  }
}

/**
 * Merge two cat images together.
 * @param {Buffer} firstImage - The first cat image as a Buffer.
 * @param {Buffer} secondImage - The second cat image as a Buffer.
 * @returns {mergeImg.MergeImg} The merged cat image.
 */
async function mergeCatImages(firstImage, secondImage) {
  return await mergeImg([
    { src: firstImage, x: 0, y: 0 },
    { src: secondImage, x: width, y: 0 },
  ]);
}

generateCatCard();
