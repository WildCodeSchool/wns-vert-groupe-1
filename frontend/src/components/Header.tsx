import React from "react";
import Link from "next/link";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainTheme } from "@theme";
import { useAuth } from "../context";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import useWindowDimensions from "../utils/windowDimensions";
import Logo from "./Logo";

export const Header = () => {
	const { onLogout, isAuthenticated, user } = useAuth();
	const { width } = useWindowDimensions();
	const router = useRouter();

	return (
		<AppBar position="static">
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
					width: width,
					backgroundColor: mainTheme.palette.primary.main,
					height: mainTheme.spacing(8),
				}}
			>
				<Link href="/" passHref>
					<Typography color="inherit" sx={{ letterSpacing: "0.04em" }}>
						CITY GUIDE
					</Typography>
				</Link>
				<Logo />
				{isAuthenticated ? (
					<Stack flexDirection="row" gap={4} marginRight={3}>
						{user?.role === "ADMIN" || user?.role === "CITYADMIN" ? (
							<AdminPanelSettingsIcon
								onClick={() => {
									router.push("/admin");
								}}
								sx={{
									fontSize: mainTheme.typography.h3,
									cursor: "pointer",
								}}
							/>
						) : (
							<></>
						)}
						<AccountCircleIcon
							onClick={() => router.push("/profil")}
							sx={{
								fontSize: mainTheme.typography.h3,
								cursor: "pointer",
							}}
						/>
						<LogoutIcon
							onClick={onLogout}
							sx={{
								fontSize: mainTheme.typography.h3,
								cursor: "pointer",
							}}
						/>
					</Stack>
				) : (
					<Link href="/login" passHref>
						<AccountCircleIcon
							sx={{
								fontSize: mainTheme.typography.h2,
								mr: mainTheme.spacing(3),
							}}
						/>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};
