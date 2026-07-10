import sharp from "sharp";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public/images");

function isBackground(r, g, b) {
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  if (saturation > 35) return false; // clearly a real color, stop here
  const brightness = (r + g + b) / 3;
  return brightness > 160; // white or checkerboard gray (~#cccccc)
}

async function removeCheckerboard(filename) {
  const inputPath = join(publicDir, filename);
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8ClampedArray(data);
  const visited = new Uint8Array(width * height);

  // BFS flood-fill from all edge pixels
  const queue = [];
  const seed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    const pi = idx * 4;
    if (isBackground(pixels[pi], pixels[pi + 1], pixels[pi + 2])) {
      queue.push(x, y);
    }
  };

  for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
  for (let y = 1; y < height - 1; y++) { seed(0, y); seed(width - 1, y); }

  while (queue.length > 0) {
    const y = queue.pop();
    const x = queue.pop();
    const idx = y * width + x;
    pixels[idx * 4 + 3] = 0; // make transparent

    const neighbors = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const nidx = ny * width + nx;
      if (visited[nidx]) continue;
      visited[nidx] = 1;
      const pi = nidx * 4;
      if (isBackground(pixels[pi], pixels[pi + 1], pixels[pi + 2])) {
        queue.push(nx, ny);
      }
    }
  }

  await sharp(Buffer.from(pixels.buffer), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(inputPath);

  console.log(`✓ ${filename} — background removed`);
}

await removeCheckerboard("magnifyingglass.png");
await removeCheckerboard("facepalm.png");
