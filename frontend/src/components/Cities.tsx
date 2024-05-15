import { useQuery } from "@apollo/client";
import { GET_ALL_CITIES } from "../graphql/queries/queries";
import { SearchForm } from "./SearchForm";

export const Cities = () => {
	const { loading, error } = useQuery(GET_ALL_CITIES);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	return (
		<>
			<SearchForm />
		</>
	);
};
