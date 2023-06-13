import axios from 'axios';
import { promisify } from 'util';

/**
 * 
 * Download a cat image from the specified URL.
 * @param {string} url - The URL of the cat image.
 * @returns {Promise<Buffer>} The downloaded image as a Buffer.
 */
export async function downloadCatImage(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      console.log(`Received response with status: ${response.status}`);
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Failed to download the cat image:', error);
      throw error;
    }
}

/**
 * Promisified version of img.getBuffer.
 * @param {mergeImg.MergeImg} img - The merged cat image.
 * @returns {Promise<Buffer>} The cat image buffer.
 */
export function getBufferAsync(img) {
  return promisify(img.getBuffer.bind(img))('image/jpeg');
}
