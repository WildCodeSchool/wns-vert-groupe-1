import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_CITY_BY_NAME } from "@queries";
import { PoiCard, SearchForm, CityMap } from "@components";
import { CityType } from "@types";
import { Box, CircularProgress, Typography } from "@mui/material";
import { mainTheme } from "@theme";

const SearchResults = () => {
	const latFrance = 46.603354;
	const lonFrance = 1.888334;
	const router = useRouter();
	const [searchedCity, setSearchedCity] = useState<CityType>({
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
			const cityData = data.getCityByName;
			setSearchedCity({
				id: cityData.id,
				name: cityData.name,
				description: cityData.description,
				pois: cityData.pois || [],
				lon: cityData.lon,
				lat: cityData.lat,
			});
		}
	}, [data, error, router.query.keyword]);

	if (loading)
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "200px",
				}}
			>
				<CircularProgress />
			</div>
		);

	return (
		<Box display="flex" justifyContent="space-between">
			<Box display="flex" flexDirection="column" flex="1">
				<SearchForm />
				{searchedCity.name !== "" ? (
					<Box>
						<Typography
							sx={{
								color: mainTheme.palette.primary.dark,
								fontSize: mainTheme.typography.h3,
								fontWeight: "bold",
							}}
						>
							{searchedCity.name}
						</Typography>
						{searchedCity.pois?.map((poi) => (
							<PoiCard
								key={poi.id}
								name={poi.name}
								images={poi.images}
								category={poi.category}
								description={poi.description}
							/>
						))}
					</Box>
				) : (
					<Typography
						sx={{
							color: mainTheme.palette.error.main,
							mb: mainTheme.spacing(2),
						}}
					>
						Aucune ville trouvée pour le terme de recherche :{" "}
						{router.query.keyword}
					</Typography>
				)}
			</Box>
			<CityMap
				lat={searchedCity.lat}
				lon={searchedCity.lon}
				pois={searchedCity.pois}
			/>
		</Box>
	);
};

export default SearchResults;
