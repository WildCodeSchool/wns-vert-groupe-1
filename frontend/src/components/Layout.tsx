import { ReactNode } from "react";
import { Header } from "./Header";
import { ThemeProvider, Container } from "@mui/material";
import { mainTheme } from "@theme";
import useWindowDimensions from "../utils/windowDimensions";
import Footer from "./Footer";
import React from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
	const { height, width } = useWindowDimensions();

	return (
		<ThemeProvider theme={mainTheme}>
			<main
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					width: width,
				}}
			>
				<Header />
				<Container
					maxWidth={false}
					sx={{
						flex: "1",
						background: mainTheme.palette.background.default,
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
				<Footer />
			</main>
		</ThemeProvider>
	);
};
