import React from "react";
import { Box, Button, List, ListItem, ListItemText, SwipeableDrawer, Toolbar } from "@mui/material";
import Link from "next/link";
import { mainTheme } from "@theme";
import { Header } from "./Header";

type Anchor = "top" | "left" | "bottom" | "right";

export default function AdminSidebar() {
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	const toggleDrawer =
		(left: Anchor, open: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event &&
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}

			setState({ ...state, [left]: open });
		};

	return (
		<div>
			<Header/>
			<React.Fragment key={"left"}>
				<Button onClick={toggleDrawer("left", true)}>left</Button>
				<SwipeableDrawer
					anchor={"left"}
					open={state["left"]}
					onClose={toggleDrawer("left", false)}
					onOpen={toggleDrawer("left", true)}
				>
					<Box
						role="presentation"
						onClick={toggleDrawer("left", false)}
						onKeyDown={toggleDrawer("left", false)}
					>
						<List>
							<ListItem
								component={Link}
								href="/admin/cities/cities"
								sx={{
									backgroundColor: mainTheme.palette.background.default,
									marginBottom: "2rem",
									marginTop: "1rem",
									borderRadius: "24px",
									marginLeft: "0.5rem",
									marginRight: "0.5rem",
									maxWidth: "calc(100% - 1rem)",
									boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								<ListItemText
									primary={<span style={{ fontSize: "0.9rem" }}>VILLES</span>}
									sx={{
										textAlign: "center",
									}}
								/>
							</ListItem>
							<ListItem
								component={Link}
								href="/admin/pois/pois"
								sx={{
									backgroundColor: mainTheme.palette.background.default,
									marginBottom: "2rem",
									marginTop: "1rem",
									borderRadius: "24px",
									marginLeft: "0.5rem",
									marginRight: "0.5rem",
									maxWidth: "calc(100% - 1rem)",
									boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								<ListItemText
									primary={
										<span style={{ fontSize: "0.8rem" }}>
											POINTS D&apos;INTERETS
										</span>
									}
									sx={{
										textAlign: "center",
									}}
								/>
							</ListItem>
							<ListItem
								component={Link}
								href="/admin/users/users"
								sx={{
									backgroundColor: mainTheme.palette.background.default,
									marginBottom: "2rem",
									marginTop: "1rem",
									borderRadius: "24px",
									marginLeft: "0.5rem",
									marginRight: "0.5rem",
									maxWidth: "calc(100% - 1rem)",
									boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								<ListItemText
									primary={
										<span style={{ fontSize: "0.8rem" }}>UTILISATEURS</span>
									}
									sx={{
										textAlign: "center",
									}}
								/>
							</ListItem>
							<ListItem
								component={Link}
								href="/admin/categories/categories"
								sx={{
									backgroundColor: mainTheme.palette.background.default,
									marginBottom: "2rem",
									marginTop: "1rem",
									borderRadius: "24px",
									marginLeft: "0.5rem",
									marginRight: "0.5rem",
									maxWidth: "calc(100% - 1rem)",
									boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
								}}
							>
								<ListItemText
									primary={
										<span style={{ fontSize: "0.8rem" }}>CATEGORIES</span>
									}
									sx={{
										textAlign: "center",
									}}
								/>
							</ListItem>
						</List>
					</Box>{" "}
				</SwipeableDrawer>
			</React.Fragment>
		</div>
	);
};
