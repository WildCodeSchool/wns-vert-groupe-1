import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("http://localhost:3000/");

	await page.getByRole("link").nth(1).click();

	await page.waitForURL("http://localhost:3000/login");
	await expect(page).toHaveURL("http://localhost:3000/login");

	await page.getByRole("link", { name: "S'inscrire" }).click();
	await page.waitForURL("http://localhost:3000/register");
	await expect(page).toHaveURL("http://localhost:3000/register");

	await page.getByPlaceholder("Prénom").fill("Adelina");

	await page.getByPlaceholder("Nom", { exact: true }).fill("Aubert");

	await page.getByPlaceholder("E-mail").fill("adelina@gmail.copm");

	await page.getByPlaceholder("Mot de passe").fill("adelina");

	await page.getByLabel("").click();
	await page.getByRole("option", { name: "Paris" }).click();
	await page.getByRole("button", { name: "Envoyer" }).click();

	await page.waitForURL("http://localhost:3000/login");
	await expect(page).toHaveURL("http://localhost:3000/login");

	await page.getByLabel("Email *").fill("adelina@gmail.com");

	await page.getByLabel("Mot de passe *").fill("adelina");

	await page.getByLabel("Se souvenir de moi").check();

	await page.getByRole("button", { name: "Envoyer" }).click();

	await page.goto("http://localhost:3000/");
});
