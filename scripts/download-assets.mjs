// Downloads all static assets from ozgur.design into /public.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE = "https://ozgur.design";
const assets = [
  ["fonts/e3b0a1.woff2", "public/fonts/Geist-latin.woff2"],
  ["fonts/e3b0a2.woff2", "public/fonts/Geist-latin-ext.woff2"],
  ["fonts/f7a2c1.otf", "public/fonts/CartographCF-Regular.otf"],
  ["fonts/f7a2c3.otf", "public/fonts/CartographCF-DemiBold.otf"],
  ["fonts/f7a2c2.otf", "public/fonts/CartographCF-Bold.otf"],
  ["assets/logo/ozg.svg", "public/assets/logo/ozg.svg"],
  ["assets/images/oz.jpg", "public/assets/images/oz.jpg"],
  ["favicon.svg", "public/seo/favicon.svg"],
  ["favicon.ico", "public/favicon.ico"],
  ["favicon-16x16.png", "public/seo/favicon-16x16.png"],
  ["favicon-32x32.png", "public/seo/favicon-32x32.png"],
  ["android-chrome-192x192.png", "public/seo/android-chrome-192x192.png"],
  ["android-chrome-512x512.png", "public/seo/android-chrome-512x512.png"],
  ["apple-touch-icon.png", "public/seo/apple-touch-icon.png"],
  ["og.png", "public/seo/og.png"],
];

async function dl([src, dest]) {
  const res = await fetch(`${BASE}/${src}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${src} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return `${dest} (${buf.length}b)`;
}

const queue = [...assets];
const results = [];
async function worker() {
  while (queue.length) {
    const a = queue.shift();
    try { results.push(await dl(a)); } catch (e) { results.push(`FAIL ${e.message}`); }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
console.log(results.join("\n"));
