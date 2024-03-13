import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import CityCard, { CityCardProps } from "../../../components/CityCard";
import SearchForm from "../../../components/SearchForm";
import CityMap from "../../../components/CityMap";
import { GET_CITY_BY_NAME } from "../../../graphql/queries/queries";

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
                    <CityMap lat={searchedCity.lat} lon={searchedCity.lon} pois={searchedCity.pois} />
                </div>
            ) : (
                <div>
                    <p className="warning">
                        Aucune ville trouvée pour le terme de recherche :{" "}
                        {router.query.keyword}
                    </p>
                    <CityMap lat={searchedCity.lat} lon={searchedCity.lon} pois={searchedCity.pois} />
                </div>
            )}
        </>
    );
};

export default SearchResults;
