import { useRouter } from "next/router";
import {
	Grid,
	TextField,
	Button,
	Paper,
	Box,
	FormControlLabel,
	Checkbox,
	Typography,
	Link,
} from "@mui/material";
import { useAuth } from "context/UserContext";
import React from "react";
import useWindowDimensions from "utils/windowDimensions";
import { mainTheme } from "@theme";

const LoginPage = () => {
	const [checked, setIsChecked] = React.useState<boolean>(false);
	const router = useRouter();
	const { onLogin, user } = useAuth();
	const { height } = useWindowDimensions();

	React.useEffect(() => {
		if (user) {
			if (user.role === "ADMIN" || user.role === "CITYADMIN") {
				router.replace("/admin");
			} else {
				router.replace("/");
			}
		}
	}, [user]);

	return (
		<Box
			height={height - 120}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Paper
				variant="elevation"
				elevation={3}
				sx={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Grid container direction={{ xs: "column", sm: "row", md: "row" }}>
					<Grid
						item
						xs={12}
						md={6}
						order={-1}
						display={{ xs: "none", md: "flex" }}
						alignItems="center"
						justifyContent="center"
						sx={{ backgroundColor: mainTheme.palette.primary.light }}
					>
						<Box>
							<img
								src="/images/logo_city_guide.png"
								alt="login"
								style={{ objectFit: "contain", width: "15em" }}
							/>
						</Box>
					</Grid>

					<Grid item xs={12} md={6} p={6}>
						<Typography
							variant="h3"
							color="primary"
							align="center"
							gutterBottom
							fontWeight="bold"
						>
							Se connecter
						</Typography>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const form = e.target;
								const formData = new FormData(form as HTMLFormElement);

								// const formJson = Object.fromEntries(formData.entries());
								const email = formData.get("email") as string;
								const password = formData.get("password") as string;
								const rememberMe = formData.get("rememberMe");
								console.log("rememberMe", rememberMe);
								onLogin({
									email: email,
									password: password,
									checked: rememberMe ? true : false,
								});
							}}
						>
							<TextField
								name="email"
								fullWidth
								label="Email"
								id="email_input"
								variant="standard"
								required
								margin="normal"
							/>
							<TextField
								name="password"
								fullWidth
								label="Mot de passe"
								id="password_input"
								variant="standard"
								type="password"
								required
								margin="normal"
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="rememberMe"
										checked={checked}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											setIsChecked(event?.target.checked)
										}
									/>
								}
								label="Se souvenir de moi"
							/>
							<Button
								variant="contained"
								color="primary"
								type="submit"
								fullWidth
								style={{
									marginBottom: "2rem",
									marginTop: "1rem",
									borderRadius: "24px",
								}}
							>
								Envoyer
							</Button>
							<Typography
								gutterBottom
								color="primary"
								variant="subtitle1"
								align="center"
								sx={{ fontSize: "1rem", textAlign: "center" }}
							>
								Pas encore de compte ?
								<Link
									href="/register"
									underline="hover"
									sx={{ fontSize: "1rem", color: "primary" }}
								>
									{" "}
									S&apos;inscrire
								</Link>
							</Typography>
							<Typography
								gutterBottom
								color="primary"
								variant="subtitle1"
								align="center"
								sx={{ fontSize: "1rem", textAlign: "center" }}
							>
								Mot de passe oublié ?
								<Link
									href="/register"
									underline="hover"
									sx={{ fontSize: "1rem", color: "primary" }}
								>
									{" "}
									Réinitialiser
								</Link>
							</Typography>
						</form>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

export default LoginPage;
