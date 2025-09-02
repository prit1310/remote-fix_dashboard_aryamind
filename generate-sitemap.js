// generate-sitemap.js
const fs = require("fs");
const path = require("path");

// your live domain
const domain = "https://remotefix.shwetatech.com";

// all static routes you want crawled
const pages = [
  "/",
  "/service",
  "/how-it-works",
  "/about",
  "/contact",
];

// build XML string
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `
  <url>
    <loc>${domain}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

// write into /public folder (so Vite copies it to dist/)
const outPath = path.resolve(__dirname, "public", "sitemap.xml");
fs.writeFileSync(outPath, sitemap.trim());

console.log(`✅ Sitemap generated at: ${outPath}`);
