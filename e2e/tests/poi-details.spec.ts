import { test, expect } from "@playwright/test";

test("Filter Paris POIs and choose one", async ({ page }) => {
	await page.goto("http://localhost:3000/city/search/paris", {
		waitUntil: "networkidle",
	});

	await page.getByTestId("Monuments").click();

	const button = await page.waitForSelector('[data-testid="poi-9"]', {
		state: "visible",
	});
	await button.click();
});