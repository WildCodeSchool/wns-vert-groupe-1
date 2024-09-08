export const capitalizeFirstLetter = (word: string) => {
	if (!word) {
		throw new Error("String can not be empty.");
	}
	return (
		word.trim().charAt(0).toUpperCase() + word.trim().slice(1).toLowerCase()
	);
};

export const capitalizeFrenchName = (text: string) => {
	const lowercaseWords = [
		"de",
		"du",
		"la",
		"le",
		"les",
		"des",
		"aux",
		"sur",
		"sous",
		"au",
		"en",
		"à",
		"et",
	];

	// Vérifier si le texte est vide
	if (!text || text.trim().length === 0) {
		throw new Error("String cannot be empty.");
	}

	return text
		.toLowerCase()
		.split(/([-\s])/g)
		.map((word, index, array) => {
			if (word.trim() !== "" && !lowercaseWords.includes(word)) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}
			return word;
		})
		.join("");
};
