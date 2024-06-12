import { test } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("http://localhost:3000/city/search/paris");
	await page
		.locator("p.MuiTypography-root", { hasText: /^Monuments$/ })
		.click();
	await page.locator("#poi-9").getByText("VOIR LE DETAIL").click();
});
