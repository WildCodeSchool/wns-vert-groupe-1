import { SearchForm } from "@components";
import * as React from "react";
import Typography from "@mui/material/Typography";

import { Box, Stack } from "@mui/material";
import { mainTheme } from "@theme";

const Home = () => {
	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			flex="1"
			spacing={1}
			sx={{ height: "100%" }}
		>
			<Box
				sx={{
					paddingLeft: mainTheme.spacing(10),
					height: "100%",
					alignItems: "flex-start",
				}}
			>
				<Typography
					sx={{
						color: mainTheme.palette.primary.contrastText,
						fontSize: mainTheme.typography.h1,
						fontWeight: "bold",
						marginBottom: mainTheme.spacing(3),
					}}
				>
					EXPLOREZ
				</Typography>
				<Typography
					sx={{
						color: mainTheme.palette.primary.main,
						fontSize: mainTheme.typography.h1,
						fontWeight: "bold",
						marginBottom: mainTheme.spacing(4),
					}}
				>
					PARIS
				</Typography>
				<Typography
					sx={{
						color: mainTheme.palette.primary.contrastText,
						fontSize: mainTheme.typography.h2,
						fontWeight: "bold",
						marginBottom: mainTheme.spacing(8),
					}}
				>
					COMME UN LOCAL
				</Typography>
				<SearchForm />
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "50%",
				}}
			>
				<img
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
					src="/images/homepage.png"
					alt="View from nature"
				/>
			</Box>
		</Stack>
	);
};

export default Home;
