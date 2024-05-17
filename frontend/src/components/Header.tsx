import React, { useContext } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { UserContext } from "./Layout";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainTheme } from "@theme";
import Logo from "./Logo";

export const Header = () => {
	const authInfo = useContext(UserContext);
	const router = useRouter();

	const handleLogout = () => {
		localStorage.removeItem("jwt");
		authInfo.refetchLogin();
		router.push("/");
	};

	return (
		<AppBar position="static">
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
				}}
			>
				<Link href="/" passHref>
					<Typography color="inherit" sx={{ letterSpacing: "0.04em" }}>
						CITY GUIDE
					</Typography>
				</Link>
				<Logo />
				{authInfo.isLoggedIn ? (
					<div>
						{authInfo.role === "admin" && (
							<Link href="/admin/users" passHref>
								<Typography color="inherit">ADMIN PANEL</Typography>
							</Link>
						)}
						<AccountCircleIcon
							sx={{
								fontSize: mainTheme.typography.h2,
								mr: mainTheme.spacing(3),
							}}
						/>
						<LogoutIcon
							onClick={handleLogout}
							sx={{
								mr: mainTheme.spacing(2),
								fontSize: mainTheme.typography.h2,
							}}
						/>
					</div>
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
