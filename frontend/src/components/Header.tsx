import React, { useContext } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Button } from "@mui/material";
import { UserContext } from "./Layout";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

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
			<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
				<Link href="/" passHref>
					<Button color="inherit" variant="text">
						CITY GUIDE
					</Button>
				</Link>
				<div>
					<img
						src="/images/logo.png"
						alt="logo"
						style={{ height: 40, marginRight: 1 }}
					/>
				</div>
				{!authInfo.isLoggedIn ? (
					<div>
						{authInfo.role === "admin" && (
							<Link href="/admin/users" passHref>
								<Button color="inherit" variant="text">
									Admin Panel
								</Button>
							</Link>
						)}
						<AccountCircleIcon />
						<LogoutIcon onClick={handleLogout} />
					</div>
				) : (
					<Link href="/login" passHref>
						<Button color="inherit" variant="text">
							Connexion
						</Button>
					</Link>
				)}
			</Toolbar>
		</AppBar>
	);
};
