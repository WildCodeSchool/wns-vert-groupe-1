import { test, expect } from "@playwright/test";

function generateUniqueEmail() {
	const timestamp = Date.now();
	return `adelina_${timestamp}@gmail.com`;
}

test.describe("User tests", () => {
	test("User subscription", async ({ page }) => {
		await page.goto("http://localhost:7000/", { waitUntil: "networkidle" });

		await page.getByTestId("AccountCircleIcon").click();

		await expect(page).toHaveURL("http://localhost:7000/login");

		await page.getByRole("link", { name: "S'inscrire" }).click();

		await expect(page).toHaveURL("http://localhost:7000/register");

		// Ensure elements are visible before interacting
		const surname = await page.waitForSelector('[data-testid="surname"]', {
			state: "visible",
		});
		await surname.fill("Adelina");

		const name = await page.waitForSelector('[data-testid="name"]', {
			state: "visible",
		});
		await name.fill("Aubert");

		const email = await page.waitForSelector('[data-testid="email"]', {
			state: "visible",
		});
    	await email.fill(generateUniqueEmail());

		const password = await page.waitForSelector('[data-testid="password"]', {
			state: "visible",
		});
		await password.fill("Adelina12345*");

		const select = await page.waitForSelector('[data-testid="city-select"]', {
			state: "visible",
		});
		await select.click();

		await page.getByRole("option", { name: "Paris" }).click();
		await page.getByTestId("submit").click();

		await expect(page).toHaveURL("http://localhost:7000/login");
	});

	// test("User authentication", async ({ page }) => {
	// 	await page.goto("http://localhost:7000/", { waitUntil: "networkidle" });

	// 	await page.getByTestId("AccountCircleIcon").click();

	// 	await expect(page).toHaveURL("http://localhost:7000/login");

	// 	const emailLogin = await page.waitForSelector('label:has-text("Email *")', {
	// 		state: "visible",
	// 	});
	// 	await emailLogin.fill("adelina@gmail.com");

	// 	const passwordLogin = await page.waitForSelector(
	// 		'label:has-text("Mot de passe *")',
	// 		{ state: "visible" }
	// 	);
	// 	await passwordLogin.fill("adelina");

	// 	await page.getByLabel("Se souvenir de moi").check();

	// 	await page.getByRole("button", { name: "Envoyer" }).click();

	// 	await expect(page).toHaveURL("http://localhost:7000/");
	// });
});


