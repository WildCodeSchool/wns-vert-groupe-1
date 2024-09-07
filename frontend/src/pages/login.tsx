import {
	Grid,
	TextField,
	Paper,
	Box,
	FormControlLabel,
	Checkbox,
	Typography,
	Link,
	IconButton,
} from "@mui/material";
import { useAuth } from "context/UserContext";
import React, { useState } from "react";
import useWindowDimensions from "utils/windowDimensions";
import { mainTheme } from "@theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RoundedButton } from "@components";

const LoginPage = () => {
	const [checked, setIsChecked] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const { onLogin, loading } = useAuth();
	const { height } = useWindowDimensions();

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowPassword(!showPassword);
	};

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
						bgcolor={mainTheme.palette.primary.light}
						padding={10}
					>
						<Box>
							<img
								src="/images/logo_city_guide.png"
								alt="login"
								style={{ objectFit: "contain", width: "15em" }}
							/>
						</Box>
					</Grid>

					<Grid item xs={12} md={6} p={10}>
						<Typography
							variant="h3"
							color="primary"
							align="center"
							gutterBottom
							fontWeight="bold"
						>
							Connexion
						</Typography>
						<Box
							component="form"
							padding={4}
							onSubmit={(e) => {
								e.preventDefault();
								const form = e.target;
								const formData = new FormData(form as HTMLFormElement);

								const email = formData.get("email") as string;
								const password = formData.get("password") as string;
								const rememberMe = formData.get("rememberMe");
								onLogin({
									email: email,
									password: password,
									checked: rememberMe ? true : false,
								});
							}}
						>
							<TextField
								data-testid="input-email"
								name="email"
								autoComplete="email"
								fullWidth
								label="Email"
								id="email_input"
								variant="standard"
								required
								margin="normal"
							/>
							<TextField
								data-testid="input-password"
								name="password"
								autoComplete="current-password"
								fullWidth
								label="Mot de passe"
								id="password_input"
								variant="standard"
								type={showPassword ? "text" : "password"}
								required
								margin="normal"
								InputProps={{
									endAdornment: (
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClick}
											edge="end"
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									),
								}}
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
							<RoundedButton type="submit" label="Se connecter">
								{!loading ? "Se connecter" : "Connexion en cours..."}
							</RoundedButton>

							<Typography
								gutterBottom
								color="primary"
								variant="subtitle1"
								align="center"
								sx={{ fontSize: "1rem", textAlign: "center" }}
							>
								Vous n&apos;avez pas de compte ?
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
						</Box>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
};

export default LoginPage;
