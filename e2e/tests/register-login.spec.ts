import { test, expect } from "@playwright/test";

test.describe("User tests", () => {
	test("User subscription", async ({ page }) => {
		await page.goto("http://localhost:3000/");

		await page.getByTestId("AccountCircleIcon").click();

		await expect(page).toHaveURL("http://localhost:3000/login");

		await page.getByRole("link", { name: "S'inscrire" }).click();

		await expect(page).toHaveURL("http://localhost:3000/register");
// to be in document puis  remplir
		await page.pause();

		const surname = page.getByTestId("surname");
		expect(surname).toBeVisible();
		await surname.fill("Adelina");

		const name = page.getByTestId("name");
		expect(name).toBeVisible();
		await name.fill("Aubert");

		const email = page.getByTestId("email");
		expect(email).toBeVisible();
		await email.fill("adelina@gmail.com");

		const password = page.getByTestId("password");
		expect(password).toBeVisible();
		await password.fill("adelina");

		const select = page.getByTestId("city-select");
		expect(select).toBeVisible();
		await select.click();

		await page.getByRole("option", { name: "Paris" }).click();
		await page.getByTestId("submit").click();

		await expect(page).toHaveURL("http://localhost:3000/login");
		
	});

	test("User authentification", async ({ page }) => {
		await page.goto("http://localhost:3000/");

		await page.getByTestId("AccountCircleIcon").click();

		await expect(page).toHaveURL("http://localhost:3000/login");
		await page.pause();

		const emailLogin = await page.getByLabel("Email *");
		await emailLogin.fill("adelina@gmail.com");

		const passwordLogin = await page.getByLabel("Mot de passe *");
		await passwordLogin.fill("adelina");

		await page.getByLabel("Se souvenir de moi").check();

		await page.getByRole("button", { name: "Envoyer" }).click();

		await expect(page).toHaveURL("http://localhost:3000/");	});
});
