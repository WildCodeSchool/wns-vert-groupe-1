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
	useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { mainTheme } from "@theme";
import { useAuth } from "../context";
import Logo from "./Logo";

type MenuItem = {
	name: string;
	link: string;
	type: string[];
};
const menuItemsData: MenuItem[] = [
	{
		name: "Utilisateurs",
		link: "/admin/user/list",
		type: ["ADMIN", "CITYADMIN"],
	},
	{ name: "Villes", link: "/admin/city/list", type: ["ADMIN"] },
	{
		name: "Points d'intérêts",
		link: "/admin/poi/list",
		type: ["ADMIN", "CITYADMIN", "SUPERUSER"],
	},
	{ name: "Catégories", link: "/admin/category/list", type: ["ADMIN"] },
];

export const Header = () => {
	const isTabletOrMobile = useMediaQuery(mainTheme.breakpoints.down("lg"));
	const { onLogout, isAuthenticated, user, isLoadingSession } = useAuth();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

	const filteredsMenuItems = React.useMemo(() => {
		if (user) {
			return menuItemsData.filter((menuItem) =>
				menuItem.type.includes(user.role)
			);
		}
	}, [user]);

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
					{isAuthenticated && user?.role !== "USER" ? (
						<IconButton
							color="inherit"
							aria-label="Ouverture du menu"
							onClick={() => setMenuOpen(!menuOpen)}
						>
							<MenuIcon
								sx={{
									fontSize: mainTheme.typography.h3,
								}}
							/>
						</IconButton>
					) : (
						<></>
					)}
					{!isTabletOrMobile ? (
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
					) : (
						<></>
					)}
				</Box>
				<Box
					paddingBottom={mainTheme.spacing(1)}
					style={{
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					}}
					onClick={() => router.push("/")}
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
						<Stack display="flex" flexDirection="row" alignContent="center">
							<IconButton
								color="inherit"
								aria-label="Profile"
								onClick={() => router.push("/profil")}
							>
								<AccountCircleIcon
									data-testid="user-button"
									sx={{
										fontSize: mainTheme.typography.h3,
									}}
								/>
							</IconButton>
							<IconButton
								color="inherit"
								aria-label="Déconnexion"
								onClick={() => {
									onLogout();
									router.push("/");
								}}
							>
								<LogoutIcon
									sx={{
										fontSize: mainTheme.typography.h3,
									}}
								/>
							</IconButton>
						</Stack>
					) : (
						<Link href="/login" passHref aria-label="Se connecter">
							<IconButton color="inherit" aria-label="Connexion">
								<AccountCircleIcon
									data-testid="user-button"
									sx={{
										fontSize: mainTheme.typography.h3,
									}}
								/>
							</IconButton>
						</Link>
					)}
				</Box>
			</Toolbar>
			{isAuthenticated && (
				<React.Fragment key={"left"}>
					<SwipeableDrawer
						anchor={"left"}
						open={menuOpen}
						onClose={() => setMenuOpen(false)}
						onOpen={() => setMenuOpen(true)}
						PaperProps={{
							sx: {
								width: isTabletOrMobile ? "100%" : "20vw",
								maxWidth: "100vw",
							},
						}}
					>
						<Box
							role="presentation"
							onClick={() => setMenuOpen(false)}
							onKeyDown={() => setMenuOpen(true)}
							width={{ xs: "100%", md: "20vw" }}
							sx={{
								backgroundColor: mainTheme.palette.primary.dark,
								height: "100%",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 10,
								justifyContent: "flex-start",
								paddingY: 10,
								paddingX: 5,
							}}
						>
							<Logo />
							<List
								sx={{
									// flex: 1,
									width: "100%",
									display: "flex",
									flexDirection: "column",
									alignContent: "center",
									paddingTop: 10,
									marginTop: 10,
									justifyContent: "flex-start",
									gap: 10,
								}}
							>
								{filteredsMenuItems &&
									filteredsMenuItems.map((menuItem, index) => (
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
