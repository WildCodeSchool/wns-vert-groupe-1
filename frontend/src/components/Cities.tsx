import { useQuery } from "@apollo/client";
import { DisplayCities } from "./DisplayCities";
import { GET_ALL_CITIES } from "@queries";
import { SearchForm } from "./SearchForm";

export const Cities = () => {
	const { loading, error, data } = useQuery(GET_ALL_CITIES);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	return (
		<>
			<SearchForm />
			<DisplayCities cities={data.getAllCities} />
		</>
	);
};
