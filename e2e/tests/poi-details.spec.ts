import { test, expect } from "@playwright/test";

test("Filter Paris POIs and choose one", async ({ page }) => {
  await page.goto("http://localhost:3000/city/search/paris");
	await page.getByTestId("Monuments").click();
	await page.pause();
	const button = page.getByTestId("poi-9");
	expect(button).toBeVisible();
	await button.click();
});
