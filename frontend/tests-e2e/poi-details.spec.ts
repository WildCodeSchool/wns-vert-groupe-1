import { test } from "@playwright/test";

test("test", async ({ page }) => {
    await page.goto("http://localhost:3000/");
	await page.getByPlaceholder("Cherchez une ville").fill("Paris");
	await page.getByLabel("search").click();
	await page
		.locator("p.MuiTypography-root", { hasText: /^Monuments$/ })
		.click();
	await page.locator("#poi-9").getByText("VOIR LE DETAIL").click();
});
