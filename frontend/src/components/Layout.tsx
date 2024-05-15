import { ReactNode, createContext } from "react";
import { Header } from "./Header";
import { useQuery } from "@apollo/client";
import { GET_AUTH_INFO } from "../graphql/queries/queries";
import {
	ThemeProvider,
	Container,
	BottomNavigation,
	Typography,
} from "@mui/material";
import { mainTheme } from "@theme";
import Link from "next/link";

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
							maxWidth={false}
							sx={{
								flex: "1",
								background: mainTheme.palette.primary.dark,
								marginLeft: 0,
								marginRight: 0,
								paddingLeft: 0,
								paddingRight: 0,
								"@media (min-width:600px)": {
									padding: 0,
									margin: 0,
								},
							}}
						>
							{children}
						</Container>
						<BottomNavigation
							sx={{
								background: mainTheme.palette.primary.light,
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
								boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.05)",
							}}
						>
							<Link href="#">
								<Typography
									sx={{
										color: mainTheme.palette.primary.main,
										mr: mainTheme.spacing(5),
										fontSize: mainTheme.typography.h5,
										letterSpacing: "0.04em",
									}}
								>
									Mentions légales
								</Typography>
							</Link>
						</BottomNavigation>
					</main>
				</ThemeProvider>
			</UserContext.Provider>
		);
	}
};
