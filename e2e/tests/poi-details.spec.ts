import { test } from "@playwright/test";

test("Filter Paris POIs and choose one", async ({ page }) => {
  await page.goto("http://frontend:3000/city/search/paris");
	await page.getByTestId("Monuments").click();
	await page.locator("#poi-9").getByText("VOIR LE DETAIL").click();
});
