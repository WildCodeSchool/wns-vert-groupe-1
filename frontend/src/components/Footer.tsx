import { BottomNavigation, Typography } from "@mui/material";
import { mainTheme } from "@theme";
import Link from "next/link";
import useWindowDimensions from "utils/windowDimensions";

export default function Footer() {
	const { height, width } = useWindowDimensions();
	return (
		<BottomNavigation
			sx={{
				background: mainTheme.palette.primary.light,
				width: width,
				display: "flex",
				bottom: 0,
				justifyContent: "flex-end",
				alignItems: "center",
				position: "sticky",
				boxShadow: "0px -2px 40px rgba(0, 0, 0, 0.05)",
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
	);
}
