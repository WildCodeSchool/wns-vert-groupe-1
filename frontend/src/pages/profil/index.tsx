import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { UPDATE_USER_BY_ID } from "@mutations";
import { GET_ALL_CITIES, GET_USER_BY_EMAIL } from "@queries";
import { mainTheme } from "@theme";
import { CityType, UserInput } from "@types";
import { errors as ErrorContext, useAuth } from "context";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "utils";

const commonTextFieldStyles = {
	"& .MuiOutlinedInput-root": {
		backgroundColor: "white",
		borderRadius: "2rem",
		"& fieldset": {
			borderColor: "transparent",
		},
		"&:hover fieldset": {
			borderColor: "transparent",
		},
		"&.Mui-focused fieldset": {
			borderColor: "transparent",
		},
		"& .MuiOutlinedInput-input": {
			paddingLeft: "2rem",
		},
	},
};

const Profile = () => {
	const { isAuthenticated, isLoadingSession, user, setUser } = useAuth();
	const router = useRouter();

	const { data } = useQuery(GET_ALL_CITIES);

	const [updateProfile, { loading }] = useMutation(UPDATE_USER_BY_ID, {
		refetchQueries: [{ query: GET_USER_BY_EMAIL }],
	});
	const [selectedCity, setSelectedCity] = useState<number | undefined>(
		user?.city?.id || undefined
	);

	const handleCityChange = (event: SelectChangeEvent<string | number>) => {
		setSelectedCity(Number(event.target.value));
	};

	useLayoutEffect(() => {
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingSession, isAuthenticated]);

	const {
		register: profileForm,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<UserInput>({
		mode: "onBlur",
	});

	const watchedName = watch("firstName");
	const watchedLastName = watch("lastName");
	const watchedEmail = watch("email");
	const watchedCity = watch("city");

	const isDisabled =
		!watchedName || !watchedLastName || !watchedEmail || !watchedCity;

	const onSubmit: SubmitHandler<UserInput> = async (formData) => {
		await updateProfile({
			variables: {
				newUserInput: {
					email: formData.email.trim(),
					firstName: formData.firstName.trim(),
					lastName: formData.lastName.trim(),
					city: Number(selectedCity),
				},
				updateUserByIdId: user?.id,
			},
		})
			.then((res) => {
				setUser(res.data.updateUserById);
				toast.success("Votre profil a bien été mis à jour !");
				reset();
			})
			.catch((err) => {
				console.error("Error update profil user:", err, err.message);
				toast.error(
					"Une erreur est survenue lors de la modification de votre profil"
				);
			})
			.finally(() => {
				reset();
			});
	};

	useEffect(() => {
		if (user) {
			reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				city: user.city?.id || undefined,
			});
			setSelectedCity(user.city.id);
		}
	}, [user, reset]);

	return isAuthenticated ? (
		<>
			<Grid
				container
				padding={8}
				flex={1}
				flexDirection="column"
				alignItems="center"
				gap={mainTheme.spacing(8)}
			>
				<Grid
					item
					width="100%"
					flexDirection="row"
					display="flex"
					paddingX={8}
					margin={mainTheme.spacing(4)}
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography
						variant="h1"
						color={mainTheme.palette.primary.main}
						fontSize={mainTheme.typography.h3.fontSize}
						textTransform="uppercase"
					>
						Profil
					</Typography>
				</Grid>
				<Grid item width="100%" paddingX={4}>
					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						flex={1}
						display="flex"
						flexDirection="column"
						justifyContent="space-evenly"
						alignItems="center"
						height="100%"
						gap={mainTheme.spacing(8)}
					>
						<TextField
							inputProps={{ "data-testid": "firstname" }}
							required
							fullWidth
							placeholder="Prénom *"
							variant="outlined"
							{...profileForm("firstName", {
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
							sx={commonTextFieldStyles}
						/>

						<TextField
							inputProps={{ "data-testid": "name" }}
							required
							fullWidth
							placeholder="Nom *"
							variant="outlined"
							{...profileForm("lastName", {
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
							sx={commonTextFieldStyles}
						/>

						<TextField
							inputProps={{ "data-testid": "email" }}
							required
							fullWidth
							placeholder="E-mail *"
							variant="outlined"
							{...profileForm("email", {
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
							sx={commonTextFieldStyles}
						/>

						<FormControl fullWidth margin="normal" error={!!errors.city}>
							<InputLabel hidden id="city-label">
								Sélectionner une ville
							</InputLabel>

							<Select
								data-testid="city-select"
								labelId="city-label"
								{...profileForm("city", {
									required: "Une ville doit être sélectionnée",
								})}
								onChange={handleCityChange}
								value={selectedCity}
								sx={{
									paddingX: 5,
									width: "100%",
									minWidth: "200px",
									backgroundColor: "white",
									borderColor: "white",
									borderRadius: 10,
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "white",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "white",
									},
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "white",
									},
								}}
							>
								{data?.getAllCities.map((city: CityType) => {
									return (
										<MenuItem key={city.id} value={city.id}>
											{city.name ? capitalizeFirstLetter(city.name) : ""}
										</MenuItem>
									);
								})}
							</Select>
							{errors.city && (
								<FormHelperText sx={{ color: "error.main" }}>
									{errors.city.message}
								</FormHelperText>
							)}
						</FormControl>
						<Button
							data-testid="submit"
							variant="contained"
							disabled={isDisabled}
							color="primary"
							type="submit"
							style={{
								marginBottom: "2rem",
								marginTop: "1rem",
								borderRadius: "24px",
							}}
						>
							{!loading ? "Enregistrer" : "Enregistrement en cours ..."}
						</Button>
					</Box>
				</Grid>
			</Grid>
		</>
	) : (
		<Typography variant="h4">{ErrorContext.connected}</Typography>
	);
};

export default Profile;
