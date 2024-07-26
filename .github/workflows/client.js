const { Client } = require("pg");

// Configuration de la connexion à la base de données
const client = new Client({
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
});

async function createUser(lastName, firstName, password, email, role, cityId) {
	try {
		// Hashage du mot de passe avec argon2
		const hashedPassword = await argon2.hash(password);

		const res = await client.query(
			`
        INSERT INTO "User" (lastName, firstName, hashedPassword, email, role, cityId)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
			[lastName, firstName, hashedPassword, email, role, cityId]
		);

		console.log("User created:", res.rows[0]);
	} catch (err) {
		console.error("Error creating user:", err.stack);
	}
}

async function main() {
	try {
		// Connexion à la base de données
		await client.connect();
		console.log("Connected to PostgreSQL");

		// Création des tables
		await client.query(`
      CREATE TABLE IF NOT EXISTS City (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        lat FLOAT NOT NULL,
        lon FLOAT NOT NULL,
        description TEXT NOT NULL
      )
    `);
		console.log('Table "City" created or already exists');

		await client.query(`
      CREATE TABLE IF NOT EXISTS Category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      )
    `);
		console.log('Table "Category" created or already exists');

		await client.query(`
      CREATE TABLE IF NOT EXISTS User (
        id SERIAL PRIMARY KEY,
        lastName VARCHAR(100) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        hashedPassword VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Utilisateur',
        cityId INT,
        FOREIGN KEY (cityId) REFERENCES City(id)
      )
    `);
		console.log('Table "User" created or already exists');

		await client.query(`
      CREATE TABLE IF NOT EXISTS POI (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        address TEXT NOT NULL,
        images TEXT NOT NULL,
        postalCode VARCHAR(5) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        averageNote FLOAT NOT NULL,
        categoryId INT,
        cityId INT,
        FOREIGN KEY (categoryId) REFERENCES Category(id),
        FOREIGN KEY (cityId) REFERENCES City(id)
      )
    `);
		console.log('Table "POI" created or already exists');

		await client.query(`
      CREATE TABLE IF NOT EXISTS Rating (
        id SERIAL PRIMARY KEY,
        rating FLOAT,
        text TEXT,
        poiId INT,
        userId INT,
        FOREIGN KEY (poiId) REFERENCES POI(id),
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `);
		console.log('Table "Rating" created or already exists');

		// Insertion de données de test
		await client.query(`
      INSERT INTO City (name, lat, lon, description)
      VALUES ('Paris', 48.8566, 2.3522, 'Capital of France')
      ON CONFLICT (name) DO NOTHING
    `);
		console.log('Test data inserted into "City" table');

		await client.query(`
      INSERT INTO Category (name)
      VALUES ('Historical')
      ON CONFLICT (name) DO NOTHING
    `);
		console.log('Test data inserted into "Category" table');

		await client.query(`
      INSERT INTO User (lastName, firstName, hashedPassword, email, role, cityId)
      VALUES ('Doe', 'John', 'hashedpassword', 'john.doe@example.com', 'Utilisateur', 1)
      ON CONFLICT (email) DO NOTHING
    `);
		console.log('Test data inserted into "User" table');

		await client.query(`
      INSERT INTO POI (name, description, address, images, postalCode, latitude, longitude, averageNote, categoryId, cityId)
      VALUES ('Eiffel Tower', 'Famous landmark in Paris', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France', 'image1.jpg', '75007', 48.8584, 2.2945, 4.7, 1, 1)
      ON CONFLICT (name) DO NOTHING
    `);
		console.log('Test data inserted into "POI" table');

		await client.query(`
      INSERT INTO Rating (rating, text, poiId, userId)
      VALUES (5, 'Amazing place!', 1, 1)
      ON CONFLICT (id) DO NOTHING
    `);
		console.log('Test data inserted into "Rating" table');

		// Exécution d'une requête pour vérifier les données
		const res = await client.query("SELECT * FROM User");
		console.log('Data from "User" table:', res.rows);
	} catch (err) {
		console.error("Error executing script", err.stack);
	} finally {
		// Fermeture de la connexion à la base de données
		await client.end();
		console.log("Disconnected from PostgreSQL");
	}
}

main();
