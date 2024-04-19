import { useState } from "react";

import { useRouter } from "next/router";

import { Paper } from "@mui/material";

import { mainTheme } from "@theme";

import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";

export const SearchForm = () => {
	const router = useRouter();
	const [error, setError] = useState(false);
	const [city, setCity] = useState("");
	const [category, setCategory] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "city") {
			setCity(e.target.value);
		} else if (e.target.name === "category") {
			setCategory(e.target.value);
		}
		setError(false);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (city.trim() === "") {
			setError(true);
			console.log("error", error);
		} else {
			setError(false);
			setCity(city);
			setCategory(category);
			router.push(`/city/search/${city}?category=${category}`);
		}
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			data-testid="search-form-container"
			sx={{
				padding: `${mainTheme.spacing(3)} ${mainTheme.spacing(3)} ${mainTheme.spacing(3)} ${mainTheme.spacing(7)}`,
				margin: mainTheme.spacing(4),
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				flexWrap: "wrap",
				borderRadius: "45px",
				boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
			}}
		>
			<SearchInput
				label="Ville"
				name="city"
				value={city}
				onChange={handleChange}
				placeholder="Où?"
				error={error}
			/>
			<SearchInput
				label="Catégorie"
				name="category"
				value={category}
				onChange={handleChange}
				placeholder="Quoi?"
			/>
			<SearchButton disabled={error} />
		</Paper>
	);
};
