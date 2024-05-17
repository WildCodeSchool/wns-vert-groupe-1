import { SearchForm } from "@components";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import { mainTheme } from "@theme";
import { ReactTyped } from "react-typed";
import useWindowDimensions from "utils/windowDimensions";

const Home = () => {
	const { height, width } = useWindowDimensions();

	return (
		<Stack
			direction="row"
			display="flex"
			alignItems="center"
			justifyContent="center"
			flex="1"
			height={height - 120}
			width={width}
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
					fontSize={{
						xs: mainTheme.typography.h2.fontSize,
						sm: mainTheme.typography.h2.fontSize,
						md: mainTheme.typography.h1.fontSize,
						lg: mainTheme.typography.h1.fontSize,
					}}
					sx={{
						color: mainTheme.palette.primary.contrastText,
						fontWeight: "bold",
						marginBottom: mainTheme.spacing(3),
					}}
				>
					EXPLOREZ
				</Typography>
				<Typography
					fontSize={{
						xs: mainTheme.typography.h2.fontSize,
						sm: mainTheme.typography.h2.fontSize,
						md: mainTheme.typography.h1.fontSize,
						lg: mainTheme.typography.h1.fontSize,
					}}
					sx={{
						color: mainTheme.palette.primary.main,
						marginBottom: mainTheme.spacing(2),
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
					fontSize={{
						xs: mainTheme.typography.h3.fontSize,
						sm: mainTheme.typography.h3.fontSize,
						md: mainTheme.typography.h2.fontSize,
						lg: mainTheme.typography.h2.fontSize,
					}}
					sx={{
						color: mainTheme.palette.primary.contrastText,
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
