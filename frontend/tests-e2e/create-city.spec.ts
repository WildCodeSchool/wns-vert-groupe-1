import { test, expect } from "@playwright/test";

test("Login as admin, open the page from create a new city and add a short description, error on the name of the city, already exists", async ({
	page,
}) => {
	await page.goto("http://localhost:7000/");

	await page.getByTestId("AccountCircleIcon").click();
	await expect(page).toHaveURL("http://localhost:7000/login");

	await page.getByLabel("Email *").fill("duygu@gmail.com");

	await page.getByLabel("Mot de passe *").fill("Password51100!");

	await page.getByRole("button", { name: "Se connecter" }).click();
	await expect(page).toHaveURL("http://localhost:7000/admin");
	await page.getByTestId("admin-button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/list");

	await page.getByTestId("add_city_button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/new");

	const form = await page.getByTestId("city-form");
	await expect(form).toBeTruthy();

	const name = await page.getByPlaceholder("Nom de la ville");
	const description = await page.getByPlaceholder("Description");

	await expect(name).toBeVisible();
	await expect(name).toBeEmpty();
	await expect(description).toBeVisible();
	await expect(description).toBeEmpty();

	const button = await page.getByRole("button", { name: "Créer" });

	await expect(button).toBeDisabled();

	await name.fill("Metz");
	await description.fill(
		"Metz [mɛs] est une commune française située dans le département de la Moselle, en Lorraine. Préfecture de département, elle fait partie, depuis le 1ᵉʳ janvier 2016, de la région administrative Grand Est, dont elle accueille les assemblées plénières. "
	);

	await button.click();
	await expect(
		page.getByText("La ville avec ce nom existe déjà")
	).toBeVisible();
});

test("Login as admin, open the page from create a new city and add a short description, error on the nomber of caracter for description is too short", async ({
	page,
}) => {
	await page.goto("http://localhost:7000/");

	await page.getByTestId("AccountCircleIcon").click();
	await expect(page).toHaveURL("http://localhost:7000/login");

	await page.getByLabel("Email *").fill("duygu@gmail.com");

	await page.getByLabel("Mot de passe *").fill("Password51100!");

	await page.getByRole("button", { name: "Se connecter" }).click();
	await expect(page).toHaveURL("http://localhost:7000/admin");
	await page.getByTestId("admin-button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/list");

	await page.getByTestId("add_city_button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/new");

	const form = await page.getByTestId("city-form");
	await expect(form).toBeTruthy();

	const name = await page.getByPlaceholder("Nom de la ville");
	const description = await page.getByPlaceholder("Description");

	await expect(name).toBeVisible();
	await expect(name).toBeEmpty();
	await expect(description).toBeVisible();
	await expect(description).toBeEmpty();

	const button = await page.getByRole("button", { name: "Créer" });

	await expect(button).toBeDisabled();

	await name.fill("Metz");
	await description.fill("Ville Nord Est");

	await button.click();
	await expect(
		page.getByText("La description doit comporter au moins 100 caractères")
	).toBeVisible();
});

test("Logged as admin, goes to the page for create a city and add a long description, submit form and toast appear", async ({
	page,
}) => {
	await page.goto("http://localhost:7000/");

	await page.getByTestId("AccountCircleIcon").click();

	await expect(page).toHaveURL("http://localhost:7000/login");

	await page.getByLabel("Email *").fill("duygu@gmail.com");
	await page.getByLabel("Mot de passe *").fill("Password51100!");

	await page.getByRole("button", { name: "Se connecter" }).click();

	await expect(page).toHaveURL("http://localhost:7000/admin");

	await page.getByTestId("admin-button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/list");

	await page.getByTestId("add_city_button").click();

	await expect(page).toHaveURL("http://localhost:7000/city/new");

	const form = await page.getByTestId("city-form");
	await expect(form).toBeTruthy();

	const name = await page.getByPlaceholder("Nom de la ville");
	const description = await page.getByPlaceholder("Description");

	await expect(name).toBeVisible();
	await expect(name).toBeEmpty();
	await expect(description).toBeVisible();
	await expect(description).toBeEmpty();

	const button = await page.getByRole("button", { name: "Créer" });

	await expect(button).toBeDisabled();

	await name.fill("Troyes");
	await description.fill(
		"Troyes est une ville française de la région Grand Est. Sa vieille ville médiévale est sillonné bordées de maisons à colombages colorées, construites pour la plupart au XVIe siècle. La ville est agrémentée de plusieurs églises gothiques aux remarquables vitraux, notamment la cathédrale de Troyes, l'église Sainte-Madeleine et la basilique Saint-Urbain. "
	);
	await button.click();

	await expect(
		page.getByText("La ville a été créée avec succès!")
	).toBeVisible();

	await expect(page).toHaveURL("http://localhost:7000/city/list");
});
