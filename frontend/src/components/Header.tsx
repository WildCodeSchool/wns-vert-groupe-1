import React from "react";
import Link from "next/link";
import {
	AppBar,
	Stack,
	Toolbar,
	Typography,
	Box,
	IconButton,
	ListItemText,
	ListItem,
	SwipeableDrawer,
	List,
	CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { mainTheme } from "@theme";
import { useAuth } from "../context";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Logo from "./Logo";

export const Header = () => {
	const { onLogout, isAuthenticated, user, isLoadingSession } = useAuth();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

	const handleMenuToggle = () => {
		setMenuOpen(!menuOpen);
		console.log(menuOpen);
	};

	const menuItems = [
		{ name: "Villes", link: "/admin/city/list" },
		{ name: "Points d'intérêt", link: "/admin/poi/list" },
		{ name: "Utilisateurs" },
		{ name: "Catégories" },
	];

	return isLoadingSession ? (
		<CircularProgress />
	) : (
		<AppBar position="static">
			<Toolbar
				sx={{
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
					width: "100%",
					backgroundColor: mainTheme.palette.primary.dark,
					height: mainTheme.spacing(8),
					position: "relative",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						left: 0,
						display: "flex",
						alignItems: "center",
					}}
				>
					{router.pathname.startsWith("/admin") && (
						<IconButton
							color="inherit"
							aria-label="open menu"
							onClick={handleMenuToggle}
						>
							<MenuIcon />
						</IconButton>
					)}
					<Link href="/" passHref>
						<Typography
							color="inherit"
							sx={{
								letterSpacing: "0.04em",
								paddingLeft: mainTheme.spacing(3),
							}}
						>
							CITY GUIDE
						</Typography>
					</Link>
				</Box>
				<Box
					paddingBottom={mainTheme.spacing(1)}
					style={{
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					<Logo />
				</Box>
				<Box
					sx={{
						position: "absolute",
						right: 0,
					}}
				>
					{isAuthenticated ? (
						<Stack flexDirection="row" gap={4}>
							{(user?.role === "ADMIN" || user?.role === "CITYADMIN") && (
								<>
									<AdminPanelSettingsIcon
										data-testid="admin-button"
										onClick={() => {
											router.push("/admin");
										}}
										sx={{
											fontSize: mainTheme.typography.h3,
											cursor: "pointer",
										}}
									/>
								</>
							)}
							<AccountCircleIcon
								// data-testid="user-button"
								onClick={() => router.push("/profil")}
								sx={{
									fontSize: mainTheme.typography.h3,
									cursor: "pointer",
								}}
							/>
							<LogoutIcon
								onClick={() => {
									onLogout();
									router.push("/");
								}}
								sx={{
									fontSize: mainTheme.typography.h3,
									cursor: "pointer",
									mr: mainTheme.spacing(3),
								}}
							/>
						</Stack>
					) : (
						<Link href="/login" passHref aria-label="Se connecter">
							<AccountCircleIcon
								sx={{
									fontSize: mainTheme.typography.h2,
									mr: mainTheme.spacing(3),
								}}
							/>
						</Link>
					)}
				</Box>
			</Toolbar>
			{router.pathname.startsWith("/admin") && (
				<React.Fragment key={"left"}>
					<SwipeableDrawer
						anchor={"left"}
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
						onOpen={() => setMenuOpen(true)}
					>
						<Box
							role="presentation"
							onClick={() => setMenuOpen(false)}
							onKeyDown={() => setMenuOpen(true)}
							sx={{
								backgroundColor: mainTheme.palette.primary.dark,
								height: "100vh",
								width: "20vw",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 10,
								paddingY: 10,
							}}
						>
							<Logo />
							<List
								sx={{
									flex: 1,
									width: "100%",
									display: "flex",
									flexDirection: "column",
									alignContent: "center",
									paddingX: 5,
									gap: 10,
								}}
							>
								{menuItems.map((menuItem, index) => (
									<Link href={menuItem.link ?? ""} key={index} passHref>
										<ListItem
											key={index}
											sx={{
												backgroundColor: mainTheme.palette.primary.light,
												borderRadius: "24px",
												maxWidth: "calc(100% - 1rem)",
											}}
										>
											<ListItemText
												disableTypography
												primary={
													<Typography
														sx={{
															fontSize: mainTheme.typography.h4,
														}}
													>
														{menuItem?.name}
													</Typography>
												}
												sx={{
													textAlign: "center",
												}}
											/>
										</ListItem>
									</Link>
								))}
							</List>
						</Box>{" "}
					</SwipeableDrawer>
				</React.Fragment>
			)}
		</AppBar>
	);
};
