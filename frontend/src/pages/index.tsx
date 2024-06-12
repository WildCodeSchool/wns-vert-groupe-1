import { SearchForm } from "@components";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Stack } from "@mui/material";
import { mainTheme } from "@theme";
import { ReactTyped } from "react-typed";
import useWindowDimensions from "utils/windowDimensions";
import { useRouter } from "next/router";

const Home = () => {
	const { height, width } = useWindowDimensions();
	const router = useRouter();

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
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				justifyContent={{
					xs: "space-between",
					sm: "space-between",
					md: "space-around",
					lg: "space-around",
				}}
				width={width * 0.5}
				paddingLeft={{ xs: 4, sm: 6, md: 8, lg: 10 }}
				gap={{ xs: 10, sm: 8, md: 6, lg: 6 }}
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
					}}
				>
					COMME UN LOCAL
				</Typography>
				<Box
					width={{
						xs: width * 0.8,
						sm: (width / 2) * 0.8,
						md: (width / 2) * 1,
						lg: (width / 2) * 0.6,
					}}
				>
					<SearchForm />
				</Box>
			</Box>
			<Box
				display="flex"
				alignItems="center"
				height="100%"
				overflow="hidden"
				width={width * 0.5}
			>
				<img
					style={{
						width: width * 1.5,
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
