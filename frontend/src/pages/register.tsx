import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { REGISTER } from "@mutations";
import { CHECK_EMAIL_UNIQUE, GET_ALL_CITIES } from "@queries";
import { CityType, UserInput } from "@types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
	Grid,
	TextField,
	Button,
	Paper,
	Typography,
	Link,
	Select,
	InputLabel,
	MenuItem,
	FormControl,
	FormHelperText,
	IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
	const router = useRouter();

	const { data } = useQuery(GET_ALL_CITIES);
	const {
		register: registerForm,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<UserInput>();

	const [cities, setCities] = useState<CityType[]>([]);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [register] = useMutation(REGISTER, {
		onCompleted: (data) => {
			if (data && data.register && !data.errors) {
				toast.success("Inscription réussie!");
				reset();
				router.push("/login");
			} else if (data.errors) {
				toast.error(data.errors[0].message);
			}
		},
		onError: (error) => {
			console.error("Error subscription :", error);
			toast.error("Une erreur est survenue lors de l&inscription");
		},
	});

	const [checkEmailUnique] = useLazyQuery(CHECK_EMAIL_UNIQUE);

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowPassword(!showPassword);
	};

	const onSubmit: SubmitHandler<UserInput> = async (formData) => {
		const { data } = await checkEmailUnique({
			variables: { email: formData.email },
		});

		if (data && !data.isEmailUnique) {
			setError("email", {
				type: "manual",
				message: "Cet email est déjà utilisé.",
			});
			return;
		}

		if (!errors.email && Object.keys(errors).length === 0) {
			await register({
				variables: {
					newUserData: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						password: formData.password,
						city: formData.city,
					},
				},
			});
		}
	};

	useEffect(() => {
		if (data) {
			setCities(data.getAllCities);
		}
	}, [data]);

	return (
		<>
			<Grid container justifyContent="center">
				<Grid item xs={12} sm={8} md={6}>
					<Paper
						variant="elevation"
						elevation={3}
						style={{ paddingLeft: "6rem", paddingRight: "6rem" }}
						component="form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Typography
							variant="h3"
							color="primary"
							align="center"
							gutterBottom
							fontWeight="bold"
							style={{
								marginBottom: "2rem",
								paddingTop: "2rem",
								marginTop: "4rem",
							}}
						>
							S&apos;inscrire
						</Typography>

						<TextField
							fullWidth
							placeholder="Prénom"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("firstName", {
								required: "Le prénom est requis",
								pattern: {
									value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
									message:
										"Le prénom ne doit pas contenir de chiffre ou de caractère spécial",
								},
								minLength: {
									value: 2,
									message: "Le prénom doit avoir au moins 2 caractères",
								},
								maxLength: {
									value: 100,
									message: "Le prénom doit avoir au maximum 100 caractères",
								},
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>

						<TextField
							fullWidth
							placeholder="Nom"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("lastName", {
								required: "Le nom est requis",
								pattern: {
									value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
									message:
										"Le nom ne doit pas contenir de chiffre ou de caractère spécial",
								},
								minLength: {
									value: 2,
									message: "Le nom doit avoir au moins 2 caractères",
								},
								maxLength: {
									value: 100,
									message: "Le nom doit avoir au maximum 100 caractères",
								},
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>

						<TextField
							fullWidth
							placeholder="E-mail"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("email", {
								required: "L'email est requis",
								pattern: {
									value: /^\S+@\S+\.\S+$/,
									message: "L'email n'est pas valide",
								},
								maxLength: {
									value: 100,
									message: "L'email doit avoir au maximum 100 caractères",
								},
							})}
							error={!!errors.email}
							helperText={errors.email?.message}
						/>

						<TextField
							fullWidth
							placeholder="Mot de passe"
							variant="standard"
							type={showPassword ? "text" : "password"}
							style={{ marginBottom: "1rem" }}
							{...registerForm("password", {
								required: "Le mot de passe est requis",
								pattern: {
									value:
										/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
									message:
										"Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
								},
								maxLength: {
									value: 150,
									message:
										"Le mot de passe doit avoir au maximum 150 caractères",
								},
							})}
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
							error={!!errors.password}
							autoComplete="new-password"
							helperText={errors.password?.message}
						/>

						<FormControl fullWidth margin="normal" error={!!errors.city}>
							<InputLabel id="city-label">Sélectionner une ville</InputLabel>
							<Select
								labelId="city-label"
								{...registerForm("city", {
									required: "Une ville doit être sélectionnée",
								})}
								defaultValue=""
								sx={{ width: "100%" }}
							>
								{cities.map((city) => (
									<MenuItem key={city.id} value={city.id}>
										{city.name}
									</MenuItem>
								))}
							</Select>
							{errors.city && (
								<FormHelperText sx={{ color: "error.main" }}>
									{errors.city.message}
								</FormHelperText>
							)}
						</FormControl>

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
							sx={{
								fontSize: "1rem",
								textAlign: "center",
								paddingBottom: "1rem",
							}}
						>
							Vous avez déjà un compte?
							<Link
								href="/login"
								underline="hover"
								sx={{ fontSize: "1rem", color: "primary" }}
							>
								{" "}
								Se connecter
							</Link>
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
};

export default Register;
