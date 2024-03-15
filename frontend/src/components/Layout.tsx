import { ReactNode, createContext } from "react";
import { Header } from "./Header";
import { useQuery } from "@apollo/client";
import { GET_AUTH_INFO } from "@queries";
import { ThemeProvider, Container } from "@mui/material";
import { mainTheme } from "@theme";

export const UserContext = createContext({
	isLoggedIn: false,
	refetchLogin: () => {},
	role: "user",
});

export const Layout = ({ children }: { children: ReactNode }) => {
	const { data, loading, error, refetch } = useQuery<{
		whoAmI: { isLoggedIn: boolean; role: string };
	}>(GET_AUTH_INFO);

	console.log("who am i data", data);

	if (loading) {
		return <p>Loading</p>;
	}
	if (error) {
		console.log("error", error);
		return <p>Error</p>;
	}

	if (data) {
		return (
			<UserContext.Provider
				value={{
					isLoggedIn: data.whoAmI.isLoggedIn,
					refetchLogin: refetch,
					role: data.whoAmI.role,
				}}
			>
				<ThemeProvider theme={mainTheme}>
					<main
						style={{
							display: "flex",
							flexDirection: "column",
							minHeight: "100vh",
						}}
					>
						<Header />
						<Container
							sx={{
								flex: "1",
								pt: mainTheme.spacing(6),
								background: mainTheme.palette.background.default,
							}}
						>
							{children}
						</Container>
					</main>
				</ThemeProvider>
			</UserContext.Provider>
		);
	}
};
