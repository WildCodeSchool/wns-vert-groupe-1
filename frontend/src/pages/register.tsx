import { useMutation, useQuery } from "@apollo/client";
import { REGISTER } from "@mutations";
import { GET_ALL_CITIES } from "@queries";
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
} from "@mui/material";

const Register = () => {
	const router = useRouter();

	const { data } = useQuery(GET_ALL_CITIES);
	const {
		register: registerForm,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserInput>();

	const [cities, setCities] = useState<CityType[]>([]);

	const [register] = useMutation(REGISTER);

	const onSubmit: SubmitHandler<UserInput> = async (data) => {
		console.log("form data", data);
		try {
			data.city = Number(data.city);
			console.log("data form", data);

			const result = await register({
				variables: {
					newUserData: {
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						password: data.password,
						city: data.city,
					},
				},
			});
			console.log("result", result);
			reset();
			router.push("/login");
		} catch (err) {
			console.error("Error submitting form:", err);
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
							{...registerForm("firstName", { required: true })}
							helperText={errors.firstName && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="Nom"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("lastName", { required: true })}
							helperText={errors.lastName && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="E-mail"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("email", {
								required: true,
								maxLength: 200,
							})}
							helperText={errors.email && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="Mot de passe"
							id="standard-basic"
							variant="standard"
							type="password"
							style={{ marginBottom: "1rem" }}
							{...registerForm("password", { required: true })}
							helperText={errors.password && "Ce champ est requis"}
						/>

						<InputLabel id="city-label">Sélectionner une ville</InputLabel>
						<Select
							labelId="city-label"
							id="city"
							defaultValue=""
							sx={{ width: "100%" }}
							{...registerForm("city")}
						>
							{cities.map((el) => (
								<MenuItem key={el.id} value={el.id}>
									{el.name}
								</MenuItem>
							))}
						</Select>

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
