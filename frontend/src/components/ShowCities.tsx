import { useQuery } from "@apollo/client";
import DisplayCities from "./DisplayCities";
import { GET_ALL_CITIES } from "../graphql/queries/queries";

const ShowCities = () => {
	const { loading, error, data } = useQuery(GET_ALL_CITIES);

	console.log("here", data);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	return <DisplayCities cities={data.getAllCities} title={"Cities"} />;
};

export default ShowCities;
