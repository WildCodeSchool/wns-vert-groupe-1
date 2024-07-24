import { ReactNode } from "react";
import { ThemeProvider, Stack } from "@mui/material";
import { mainTheme } from "@theme";
import Footer from "./Footer";
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Header } from "./Header";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider theme={mainTheme}>
			<main
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					width: "100%",
				}}
			>
				<AdminSidebar />
				<Stack
					flex={1}
					display="flex"
					alignItems="center"
					justifyContent="center"
					sx={{ backgroundColor: mainTheme.palette.background.default }}
				>
					{children}
				</Stack>
				<Footer />
			</main>
		</ThemeProvider>
	);
};
