import { SearchForm } from "@components";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import { mainTheme } from "@theme";
import { ReactTyped } from "react-typed";
const Home = () => {
	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			flex="1"
			spacing={1}
			sx={{ height: "100%", marginRight: mainTheme.spacing(12) }}
			marginTop="5%"
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "50%",
					alignItems: "flex-start",
					padding: "4%",
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
						marginBottom: mainTheme.spacing(2),
						fontSize: mainTheme.typography.h1,
						fontWeight: "bold",
					}}
				>
					<ReactTyped
						strings={["PARIS", "LYON", "NICE", "REIMS", "LILLE", "ANNECY"]}
						typeSpeed={80}
						backSpeed={90}
						loop
					/>
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
				<Box sx={{ width: "80%" }}>
					<SearchForm />
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					height: "100%",
					overflow: "hidden",
					width: "50%",
				}}
			>
				<img
					style={{
						width: "150%",
						height: "auto",
						objectFit: "cover",
						transform: "translateX(+5%)",
					}}
					src="/images/homepage.png"
					alt="View from nature"
				/>
			</Box>
		</Stack>
	);
};
export default Home;
