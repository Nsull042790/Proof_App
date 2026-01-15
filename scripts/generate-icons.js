// Simple script to generate app icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// For the demo, we'll create a simple 1x1 gold pixel PNG as a placeholder
// In production, you'd use proper icon generation tools

// Minimal PNG structure for a gold-colored icon
// This creates a valid but minimal PNG file

function createMinimalPNG(size, filepath) {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (image header)
  const width = Buffer.alloc(4);
  width.writeUInt32BE(size);
  const height = Buffer.alloc(4);
  height.writeUInt32BE(size);

  const ihdrData = Buffer.concat([
    width,
    height,
    Buffer.from([8, 2, 0, 0, 0]) // bit depth, color type (RGB), compression, filter, interlace
  ]);

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk (image data) - simple gold color
  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      // Create a circular gold icon on black background
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.4;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance < radius) {
        // Gold color (#FFD700)
        rawData.push(255, 215, 0);
      } else {
        // Black background (#0a0a0a)
        rawData.push(10, 10, 10);
      }
    }
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

  // Ensure directory exists
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filepath, png);
  console.log('Created:', filepath);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);

  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return crc ^ 0xffffffff;
}

// Generate icons
createMinimalPNG(192, 'public/icons/icon-192.png');
createMinimalPNG(512, 'public/icons/icon-512.png');

console.log('Icons generated successfully!');
