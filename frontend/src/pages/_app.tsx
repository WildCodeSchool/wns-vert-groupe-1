import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Layout } from "@components";
import "../styles/globals.css";

const backend_url =
	process.env.NODE_ENV === "development"
		? "http://localhost:4000/api/graphql"
		: "/graphql";

const httpLink = createHttpLink({
	uri: backend_url,
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("jwt");
	console.log("token", token);
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

console.log("authLink", authLink);

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={client}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ApolloProvider>
	);
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
