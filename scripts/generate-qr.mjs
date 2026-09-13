// Generates public/qrcode.svg, the "download the app" QR code shown in the
// home hero. The code encodes our own /download URL (redirected to the store
// in next.config.ts), so the store link can change without replacing any
// printed or shared QR codes.
//
// Run: pnpm qr:generate
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const TARGET_URL = "https://www.smarttaxbd.com/download";
const LOGO_PATH = new URL("../public/smart-tax-logo.png", import.meta.url);
const OUTPUT_PATH = new URL("../public/qrcode.svg", import.meta.url);

// Quiet zone around the code, in modules (QR spec minimum is 4).
const MARGIN = 4;
// Logo width as a share of the code. Error correction level H recovers ~30%
// damaged data, so a ~25% wide logo stays comfortably scannable.
const LOGO_RATIO = 0.25;
// The source logo is 500px; this is plenty for print and keeps the SVG small.
const LOGO_PIXELS = 256;

const { modules } = QRCode.create(TARGET_URL, { errorCorrectionLevel: "H" });
const size = modules.size;

// Keep the logo box on whole modules and exactly centered.
let logoSize = Math.round(size * LOGO_RATIO);
if ((size - logoSize) % 2 !== 0) logoSize += 1;
const logoStart = (size - logoSize) / 2;
const logoEnd = logoStart + logoSize;

const isUnderLogo = (row, col) =>
  row >= logoStart && row < logoEnd && col >= logoStart && col < logoEnd;
const isDark = (row, col) => modules.get(row, col) && !isUnderLogo(row, col);

// One path for all dark modules, merging horizontal runs to keep it small.
let path = "";
for (let row = 0; row < size; row++) {
  for (let col = 0; col < size; col++) {
    if (!isDark(row, col)) continue;
    const start = col;
    while (col + 1 < size && isDark(row, col + 1)) col++;
    const width = col - start + 1;
    path += `M${start + MARGIN} ${row + MARGIN}h${width}v1h-${width}z`;
  }
}

const logo = (
  await sharp(fileURLToPath(LOGO_PATH))
    .resize(LOGO_PIXELS)
    .png({ palette: true })
    .toBuffer()
).toString("base64");
const total = size + MARGIN * 2;
// Inset the logo half a module so it doesn't touch the surrounding modules.
const logoX = logoStart + MARGIN + 0.5;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="1024" height="1024">
<rect width="${total}" height="${total}" fill="#fff"/>
<path d="${path}" fill="#000" shape-rendering="crispEdges"/>
<image href="data:image/png;base64,${logo}" x="${logoX}" y="${logoX}" width="${logoSize - 1}" height="${logoSize - 1}"/>
</svg>
`;

await writeFile(OUTPUT_PATH, svg);
console.log(`Wrote public/qrcode.svg (${size}x${size} modules) -> ${TARGET_URL}`);
