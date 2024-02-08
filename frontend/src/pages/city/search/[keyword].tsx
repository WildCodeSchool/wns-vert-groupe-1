import { GET_CITY_BY_NAME } from "@queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CityCard, SearchForm, CityMap } from "@components";
import { CityCardProps } from "@types";

const SearchResults = () => {
	const latFrance = 46.603354;
	const lonFrance = 1.888334;
	const router = useRouter();
	const [searchedCity, setSearchedCity] = useState<CityCardProps>({
		name: "",
		description: "",
		pois: [],
		lat: undefined,
		lon: undefined,
	});

	const { loading, error, data } = useQuery(GET_CITY_BY_NAME, {
		variables: { name: router.query.keyword },
	});

	useEffect(() => {
		if (error) {
			console.error("Error fetching city:", error.message);
			setSearchedCity({
				name: "",
				description: "",
				pois: [],
				lat: latFrance,
				lon: lonFrance,
			});
		}

		if (!loading && data && data.getCityByName) {
			setSearchedCity({
				id: data.getCityByName.id,
				name: data.getCityByName.name,
				description: data.getCityByName.description,
				pois: data.getCityByName.pois || [],
				lon: data.getCityByName.lon,
				lat: data.getCityByName.lat,
			});
		}
	}, [data, error, router.query.keyword]);

	if (loading) return <p>Loading...</p>;

	return (
		<>
			<SearchForm />
			{searchedCity.name !== "" ? (
				<div>
					<CityCard
						name={searchedCity.name}
						description={searchedCity.description}
						pois={searchedCity.pois}
					/>
					<CityMap lat={searchedCity.lat} lon={searchedCity.lon} />
				</div>
			) : (
				<div>
					<p className="warning">
						Aucune ville trouvée pour le terme de recherche :{" "}
						{router.query.keyword}
					</p>
					<CityMap lat={latFrance} lon={lonFrance} />
				</div>
			)}
		</>
	);
};

export default SearchResults;
