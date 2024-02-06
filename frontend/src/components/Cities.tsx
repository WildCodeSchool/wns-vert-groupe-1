import { useQuery } from "@apollo/client";
import DisplayCities from "./DisplayCities";
import { GET_ALL_CITIES } from "../graphql/queries/queries";

const Cities = () => {
	const { loading, error, data } = useQuery(GET_ALL_CITIES);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	return <DisplayCities cities={data.getAllCities} />;
};

export default Cities;
