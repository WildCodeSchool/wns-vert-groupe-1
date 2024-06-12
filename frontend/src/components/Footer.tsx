import { BottomNavigation, Typography } from "@mui/material";
import { mainTheme } from "@theme";
import Link from "next/link";

export default function Footer() {
	return (
		<BottomNavigation
			sx={{
				background: mainTheme.palette.primary.light,
				width: "100%",
				display: "flex",
				bottom: 0,
				justifyContent: "flex-end",
				alignItems: "center",
				position: "sticky",
				boxShadow: "0px -2px 40px rgba(0, 0, 0, 0.05)",
				height: mainTheme.spacing(10),
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
