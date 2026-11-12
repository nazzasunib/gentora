// Renders GENTORA's procedural 3D products to studio JPGs in public/images/studio.
// Usage: npm run dev   (in another terminal)  →  node scripts/render-stills.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = new URL("../public/images/studio/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const shots = [
  ["watch", "steel"], ["watch", "noir"], ["watch", "gold"],
  ["bag", "brown"], ["bag", "black"], ["bag", "tan"],
  ["belt", "brown"], ["belt", "black"], ["belt", "tan"],
];
const only = process.argv[2];

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1000, height: 1250 }, deviceScaleFactor: 1 });
for (const [model, variant] of shots) {
  if (only && only !== model) continue;
  await page.goto(`${BASE}/studio?model=${model}&variant=${variant}`, { waitUntil: "networkidle" });
  await page.waitForSelector("body[data-ready='1']", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const file = `${OUT}${model}-${variant}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 88, timeout: 120000 });
  console.log("rendered", file);
}
await browser.close();
