import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_CITY_BY_NAME } from "@queries";
import { PoiCard, SearchForm, CityMap, Tag } from "@components";
import { CategoryType, CityType, PoiType } from "@types";
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
	const [categoryTags, setCategoryTags] = useState<CategoryType[]>([]);
	const [activeCategories, setActiveCategories] = useState<string[]>([]);
	const [filteredPois, setFilteredPois] = useState<PoiType[]>([]);
	const [dataFetched, setDataFetched] = useState(false);

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
			setDataFetched(true);
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
			const categories: CategoryType[] = [];
			cityData.pois.forEach((poi: PoiType) => {
				if (poi.category && !categories.includes(poi.category)) {
					categories.push(poi.category);
				}
			});

			setCategoryTags(categories);
			setFilteredPois(cityData.pois!);
			setDataFetched(true);
		}
	}, [data, error, loading, router.query.keyword]);

	useEffect(() => {
		if (activeCategories.length === 0) {
			setFilteredPois(searchedCity.pois!);
		} else {
			const filtered = searchedCity.pois!.filter(
				(poi) => poi.category && activeCategories.includes(poi.category.name)
			);
			setFilteredPois(filtered);
		}
	}, [activeCategories, searchedCity.pois]);

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

	const handleCategoryTagClick = (categoryName: string) => {
		if (categoryName === "Tous les catégories") {
			setActiveCategories([]);
		} else {
			setActiveCategories((prevActiveCategories) => {
				if (prevActiveCategories.includes(categoryName)) {
					return prevActiveCategories.filter((name) => name !== categoryName);
				} else {
					return [...prevActiveCategories, categoryName];
				}
			});
		}
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
					<Tag
						key={"category-tag-all-categories"}
						name="Tous les catégories"
						isActive={activeCategories.length === 0}
						onClick={() => handleCategoryTagClick("Tous les catégories")}
					/>
					{categoryTags.map((category) => (
						<Tag
							key={category.id}
							name={category.name}
							isActive={activeCategories.includes(category.name)}
							onClick={() => handleCategoryTagClick(category.name)}
						/>
					))}
				</Box>
				{searchedCity.name !== "" && data!! ? (
					<Box padding={mainTheme.spacing(6)}>
						<Typography
							sx={{
								color: mainTheme.palette.primary.dark,
								fontSize: mainTheme.typography.h3,
								fontWeight: "bold",
							}}
						>
							{searchedCity.name} ({filteredPois.length})
						</Typography>
						{filteredPois?.map((poi) => (
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
					dataFetched && (
						<Typography
							sx={{
								color: mainTheme.palette.error.main,
								mb: mainTheme.spacing(2),
							}}
						>
							Aucune ville trouvée pour le terme de recherche :{" "}
							{router.query.keyword}
						</Typography>
					)
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
