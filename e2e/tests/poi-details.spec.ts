import { test, expect } from "@playwright/test";

test("Filter Paris POIs and choose one", async ({ page }) => {
  await page.pause();
  await page.goto(`/city/search/paris`);
  await page.getByTestId("Monuments").click();
  await page.pause();
  const button = page.getByTestId("poi-9");
  await expect(button).toBeVisible();
  await button.click();
  await expect(page).toHaveURL(`/poi/9`);
});
