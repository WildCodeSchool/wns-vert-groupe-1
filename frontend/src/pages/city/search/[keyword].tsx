import { GET_CITY_BY_NAME } from "@queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CityCard } from "@components";
import { CityCardProps } from "@types";

const SearchResults = () => {
	const router = useRouter();
	const [searchedCity, setSearchedCity] = useState<CityCardProps>({
		name: "",
		description: "",
		pois: [],
	});

	const { loading, error, data } = useQuery(GET_CITY_BY_NAME, {
		variables: { name: router.query.keyword },
	});

	useEffect(() => {
		if (error) {
			console.error("Error fetching city:", error.message);
			setSearchedCity({
				name: "", // Set name to null to trigger the "No city found" message
				description: "",
				pois: [],
			});
		}

		if (!loading && data && data.getCityByName) {
			setSearchedCity({
				id: data.getCityByName.id,
				name: data.getCityByName.name,
				description: data.getCityByName.description,
				pois: data.getCityByName.pois || [],
			});
		}
	}, [loading, error, data, router.query.keyword]);

	console.log("seéarch", searchedCity);

	return (
		<>
			{searchedCity.name !== "" ? (
				<CityCard
					name={searchedCity.name}
					description={searchedCity.description}
					pois={searchedCity.pois}
				/>
			) : (
				<p>
					Aucune ville trouvée pour le terme de recherche :{" "}
					{router.query.keyword}
				</p>
			)}
		</>
	);
};

export default SearchResults;
