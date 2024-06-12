import { test, expect } from "@playwright/test";

test.describe("User tests", () => {
	test("User subscription", async ({ page }) => {
		await page.goto("http://frontend:3000/");

		await page.getByTestId("AccountCircleIcon").click();

		await expect(page).toHaveURL("http://frontend:3000/login");

		await page.getByRole("link", { name: "S'inscrire" }).click();

		await expect(page).toHaveURL("http://frontend:3000/register");

		await page.getByTestId("surname").fill("Adelina");
		await page.getByTestId("name").fill("Aubert");
		await page.getByTestId("email").fill("adelina@gmail.copm");
		await page.getByTestId("password").fill("adelina");
		await page.getByTestId("name").fill("Adelina");

		await page.getByTestId("city-select").click();
		await page.getByRole("option", { name: "Paris" }).click();
		await page.getByTestId("submit").click();

		await expect(page).toHaveURL("http://frontend:3000/login");
		
	});

	test("User authentification", async ({ page }) => {
		await page.goto("http://frontend:3000/");

		await page.getByTestId("AccountCircleIcon").click();

		await expect(page).toHaveURL("http://frontend:3000/login");

		const emailLogin = await page.getByLabel("Email *");
		await emailLogin.fill("adelina@gmail.com");

		const passwordLogin = await page.getByLabel("Mot de passe *");
		await passwordLogin.fill("adelina");

		await page.getByLabel("Se souvenir de moi").check();

		await page.getByRole("button", { name: "Envoyer" }).click();

		await page.goto("http://frontend:3000/");
	});
});
