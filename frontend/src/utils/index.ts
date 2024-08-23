export const capitalizeFirstLetter = (word: string) => {
	if (!word) {
		throw new Error("String can not be empty.");
	}
	return (
		word.trim().charAt(0).toUpperCase() + word.trim().slice(1).toLowerCase()
	);
};
