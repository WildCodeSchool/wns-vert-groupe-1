import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_CITY_BY_NAME } from "@queries";
import { PoiCard, SearchForm, CityMap, Tag } from "@components";
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

	const [activePoiId, setActivePoiId] = useState<number | null>(null);

	// TODO replace fake tags data
	const [tags, setTags] = useState(["Paris", "Monuments"]);
	const handleCloseTag = (tagName: string) => {
		setTags(tags.filter((tag) => tag !== tagName));
	};

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

	const scrollToPoi = (poiId: number) => {
		setActivePoiId(poiId);
		const poiElementId = `poi-${poiId}`;

		const poiElement = document.getElementById(poiElementId);

		if (poiElement) {
			poiElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const handleMouseOverPoi = (poiId: number) => {
		setActivePoiId(poiId);
	};

	const handleMouseOutPoi = () => {
		setActivePoiId(null);
	};

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
		<Box display="flex">
			<Box flex="1" maxHeight="100vh" overflow="auto">
				<Box padding={mainTheme.spacing(6)}>
					<SearchForm />
				</Box>
				<Box
					display="flex"
					alignItems="center"
					gap={mainTheme.spacing(3)}
					paddingLeft={mainTheme.spacing(6)}
					paddingRight={mainTheme.spacing(6)}
				>
					{tags.map((tag) => (
						<Tag key={tag} name={tag} onClose={() => handleCloseTag(tag)} />
					))}
				</Box>
				{searchedCity.name !== "" ? (
					<Box padding={mainTheme.spacing(6)}>
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
								id={poi.id}
								key={poi.id}
								name={poi.name}
								images={poi.images}
								category={poi.category}
								description={poi.description}
								onMouseOver={() => handleMouseOverPoi(poi.id)}
								onMouseOut={handleMouseOutPoi}
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
				activePoiId={activePoiId}
				onMarkerClick={(poiId) => scrollToPoi(poiId)}
			/>
		</Box>
	);
};

export default SearchResults;
