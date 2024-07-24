import { Typography, Button, TextField, Paper, Box, Grid } from "@mui/material";
import { mainTheme } from "@theme";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useLayoutEffect } from "react";
import { CREATE_NEW_CITY } from "@mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CityInput } from "@types";
import { toast } from "react-toastify";
import { useAuth } from "context";
import { useRouter } from "next/navigation";
import { CHECK_CITY_UNIQUE } from "@queries";

const NewCity = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const [createNewCity] = useMutation(CREATE_NEW_CITY, {
		onCompleted: () => {
			toast.success("La ville a été créée avec succès!");
			reset();
			router.push("/city/list");
		},
		onError: (error) => {
			console.error("Error creating city:", error, error.message);
			toast.error("Une erreur est survenue lors de la création de la ville");
		},
	});

	const [checkCityUnique] = useLazyQuery(CHECK_CITY_UNIQUE);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setError,
		formState: { errors },
	} = useForm<CityInput>({
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const watchedName = watch("name");
	const watchedDescription = watch("description");

	const isDisabled = !watchedName || !watchedDescription;

	const onSubmit: SubmitHandler<CityInput> = async (formData) => {
		const { data } = await checkCityUnique({
			variables: { name: formData.name },
		});

		if (data && !data.isCityNameUnique) {
			setError("name", {
				type: "manual",
				message: "La ville avec ce nom existe déjà",
			});
			return;
		}

		if (!errors.name && Object.keys(errors).length === 0) {
			await createNewCity({
				variables: { cityData: formData },
			});
		}
	};

	useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	return isAuthenticated ? (
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width={{ xs: "85%", lg: "60%" }}
			height={window.innerHeight * 0.7}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Grid container flex={1}>
				<Grid
					item
					flex={1}
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						flex={1}
						display="flex"
						flexDirection="column"
						justifyContent="space-evenly"
						alignItems="center"
						height="100%"
						padding={5}
						gap={6}
					>
						<Typography
							fontFamily={mainTheme.typography.fontFamily}
							fontSize={{
								sx: mainTheme.typography.h6.fontSize,
								sm: mainTheme.typography.h5.fontSize,
								md: mainTheme.typography.h4.fontSize,
								lg: mainTheme.typography.h3.fontSize,
							}}
							color={mainTheme.palette.primary.main}
							fontWeight={mainTheme.typography.fontWeightMedium}
						>
							Création d&apos;une nouvelle ville
						</Typography>
						<TextField
							data-testid="input_name"
							id="name"
							variant="standard"
							placeholder="Nom de la ville"
							required
							size="medium"
							fullWidth
							margin="normal"
							{...register("name", {
								required: "Le nom de la ville est requis",
								minLength: {
									value: 1,
									message: "Le nom doit comporter au moins 1 caractère",
								},
								maxLength: {
									value: 50,
									message: "Le nom ne doit pas dépasser 50 caractères",
								},
							})}
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
						<TextField
							data-testid="input_description"
							id="description"
							variant="standard"
							placeholder="Description"
							multiline
							rows={5}
							required
							size="medium"
							fullWidth
							margin="normal"
							{...register("description", {
								required: "La description est requise",
								minLength: {
									value: 100,
									message:
										"La description doit comporter au moins 100 caractères",
								},
							})}
							error={!!errors.description}
							helperText={errors.description?.message}
						/>
						<Button
							disabled={isDisabled}
							type="submit"
							variant="contained"
							color="primary"
						>
							Créer
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	) : (
		<Typography>Vous devez être connecté pour accéder à cette page.</Typography>
	);
};

export default NewCity;
