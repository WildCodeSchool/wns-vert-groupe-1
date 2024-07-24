// import { test } from "@playwright/test";

// test("Filter Paris POIs and choose one", async ({ page }) => {
// 	await page.goto("http://localhost:7000/city/search/paris", {
// 		waitUntil: "networkidle",
// 	});

// 	const filter = await page.waitForSelector('[data-testid="Monuments"]', {
// 		state: "visible",
// 	});
// 	await filter.click();

// 	const button = await page.waitForSelector('[data-testid="poi-9"]', {
// 		state: "visible",
// 	});
// 	await button.click();
// });