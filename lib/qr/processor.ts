export type QrProcessorInput = {
  originalDataUrl: string;
  referenceDataUrl: string;
  size?: number;
  quietZone?: number;
};

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load image."));
    img.src = src;
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function avgColors(data: Uint8ClampedArray) {
  let r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0, c1 = 0, c2 = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (r + g + b) / 3;
    if (lum < 128) {
      r1 += r; g1 += g; b1 += b; c1++;
    } else {
      r2 += r; g2 += g; b2 += b; c2++;
    }
  }
  const dark = c1 ? [r1 / c1, g1 / c1, b1 / c1] : [24, 26, 32];
  const light = c2 ? [r2 / c2, g2 / c2, b2 / c2] : [245, 247, 255];
  return { dark, light };
}

export async function processQrArtwork({
  originalDataUrl,
  referenceDataUrl,
  size = 1024,
  quietZone = 32
}: QrProcessorInput): Promise<string> {
  const [original, reference] = await Promise.all([
    createImage(originalDataUrl),
    createImage(referenceDataUrl)
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available.");

  const refCanvas = document.createElement("canvas");
  refCanvas.width = 96;
  refCanvas.height = 96;
  const refCtx = refCanvas.getContext("2d");
  if (!refCtx) throw new Error("Reference canvas not available.");
  refCtx.drawImage(reference, 0, 0, refCanvas.width, refCanvas.height);
  const refData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height).data;
  const { dark, light } = avgColors(refData);

  // Base QR is preserved by keeping a hard high-contrast luminance split.
  // This is intentionally lightweight and approximate; it is not a true QR decoder/encoder.
  ctx.fillStyle = `rgb(${Math.round(light[0])}, ${Math.round(light[1])}, ${Math.round(light[2])})`;
  ctx.fillRect(0, 0, size, size);

  const contentSize = size - quietZone * 2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(original, quietZone, quietZone, contentSize, contentSize);

  const imageData = ctx.getImageData(quietZone, quietZone, contentSize, contentSize);
  const pixels = imageData.data;

  for (let y = 0; y < contentSize; y++) {
    for (let x = 0; x < contentSize; x++) {
      const i = (y * contentSize + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      if (a === 0) continue;

      const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      const isDark = lum < 0.62;

      if (isDark) {
        const dx = x / contentSize;
        const dy = y / contentSize;
        const refMix = (Math.sin((dx + dy) * Math.PI * 2) + 1) / 2;
        const rr = clamp(dark[0] * (0.78 + refMix * 0.22), 0, 255);
        const gg = clamp(dark[1] * (0.78 + (1 - refMix) * 0.22), 0, 255);
        const bb = clamp(dark[2] * 0.78 + light[2] * 0.08, 0, 255);

        pixels[i] = rr;
        pixels[i + 1] = gg;
        pixels[i + 2] = bb;
        pixels[i + 3] = 255;
      } else {
        const tint = 0.03;
        pixels[i] = light[0] * (1 - tint) + dark[0] * tint;
        pixels[i + 1] = light[1] * (1 - tint) + dark[1] * tint;
        pixels[i + 2] = light[2] * (1 - tint) + dark[2] * tint;
        pixels[i + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, quietZone, quietZone);

  // Texture veil from the reference photo at low opacity, kept subtle to avoid killing scanability.
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.filter = "saturate(1.2) contrast(1.05)";
  ctx.drawImage(reference, 0, 0, size, size);
  ctx.restore();

  // Re-assert a clean quiet zone.
  ctx.fillStyle = `rgb(${Math.round(light[0])}, ${Math.round(light[1])}, ${Math.round(light[2])})`;
  ctx.fillRect(0, 0, size, quietZone);
  ctx.fillRect(0, size - quietZone, size, quietZone);
  ctx.fillRect(0, 0, quietZone, size);
  ctx.fillRect(size - quietZone, 0, quietZone, size);

  return canvas.toDataURL("image/png");
}
