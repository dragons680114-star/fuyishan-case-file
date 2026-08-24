import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const pages = ["", "geo-ai/", "precision-worktime/", "solar-report/"];
const server = spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/index.html`);
      if (response.ok) {
        await response.arrayBuffer();
        return;
      }
    } catch (_) {
      // The server may need a moment to start on a fresh CI runner.
    }
    await delay(250);
  }
  throw new Error("Local HTTP server did not become ready.");
}

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  desktop.on("pageerror", (error) => errors.push(error.message));

  for (const page of pages) {
    await desktop.goto(`${baseUrl}/${page}`, { waitUntil: "networkidle" });
    if (!await desktop.title()) throw new Error(`${page || "index.html"} has no title.`);
    const brokenImages = await desktop.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length);
    if (brokenImages) throw new Error(`${page || "index.html"} has ${brokenImages} broken image(s).`);
  }

  await desktop.goto(`${baseUrl}/geo-ai/`, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "開始理解" }).click();
  if (await desktop.locator('[data-slide="0"]').getAttribute("aria-hidden") !== "true") {
    throw new Error("GEO start button did not change the active slide.");
  }
  await desktop.evaluate(() => document.activeElement?.blur());
  await desktop.keyboard.press("ArrowRight");
  if (await desktop.locator("#current-page").textContent() !== "03") {
    throw new Error("GEO keyboard navigation did not advance the deck.");
  }

  await desktop.goto(`${baseUrl}/precision-worktime/`, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: /開始導覽/ }).click();
  if (await desktop.locator("[data-slide].is-active").count() !== 1) {
    throw new Error("Precision Worktime did not keep exactly one active slide.");
  }

  await desktop.goto(`${baseUrl}/solar-report/`, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "下一頁" }).click();
  if (await desktop.locator(".slide.active").count() !== 1) {
    throw new Error("Solar Report next button did not select one active slide.");
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const page of pages) {
    await mobile.goto(`${baseUrl}/${page}`, { waitUntil: "networkidle" });
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) throw new Error(`${page || "index.html"} overflows horizontally at mobile width.`);
  }

  await browser.close();
  if (errors.length) throw new Error(`Browser page errors: ${errors.join(" | ")}`);
  console.log("Browser smoke test passed.");
} finally {
  server.kill();
}
