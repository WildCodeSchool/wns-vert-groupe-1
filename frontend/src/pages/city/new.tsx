import {
	Typography,
	Button,
	TextField,
	Box,
	Grid,
	CircularProgress,
} from "@mui/material";
import { mainTheme } from "@theme";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useLayoutEffect } from "react";
import { CREATE_NEW_CITY } from "@mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CityInput } from "@types";
import { toast } from "react-toastify";
import { errors as ErrorContext, useAuth } from "context";
import { useRouter } from "next/navigation";
import { CHECK_CITY_UNIQUE } from "@queries";
import RoundedBox from "components/RoundedBox";
import { BackButton } from "@components";

const NewCity = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
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
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			} else {
				if (user?.role !== "ADMIN") {
					router.replace("/");
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isLoadingSession, user?.role]);

	return isLoadingSession ? (
		<CircularProgress />
	) : !isAuthenticated ? (
		<Typography>{ErrorContext.connected}</Typography>
	) : (
		<>
			{user?.role !== "ADMIN" ? (
				<Typography>{ErrorContext.role}</Typography>
			) : (
				<Grid
					container
					flex={1}
					paddingX={10}
					alignItems="center"
					direction="column"
				>
					<BackButton />
					<Grid item flex={1} width="100%">
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
							<RoundedBox color={mainTheme.palette.primary.main}>
								<Typography
									fontFamily={mainTheme.typography.fontFamily}
									fontSize={{
										sx: mainTheme.typography.h6.fontSize,
										sm: mainTheme.typography.h5.fontSize,
										md: mainTheme.typography.h4.fontSize,
										lg: mainTheme.typography.h3.fontSize,
									}}
									color={mainTheme.palette.primary.light}
									fontWeight={mainTheme.typography.fontWeightMedium}
								>
									Création d&apos;une nouvelle ville
								</Typography>
							</RoundedBox>
							<TextField
								data-testid="input_name"
								id="name"
								variant="outlined"
								placeholder="Nom de la ville *"
								required
								size="medium"
								fullWidth
								margin="normal"
								{...register("name", {
									required: "Le nom de la ville est requis",
									pattern: {
										value: /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-\s]+$/,
										message:
											"Le nom de la ville ne peut contenir que des lettres, des espaces, des traits d'union, des apostrophes ou des caractères accentués.",
									},
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
								sx={{
									"& .MuiInputBase-root": {
										backgroundColor: "white",
										borderRadius: "2rem",
										paddingLeft: 5,
									},
								}}
							/>
							<TextField
								data-testid="input_description"
								id="description"
								variant="outlined"
								placeholder="Description *"
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
								sx={{
									"& .MuiInputBase-root": {
										backgroundColor: "white",
										borderRadius: "2rem",
										paddingLeft: 7,
									},
								}}
							/>
							<Button
								data-testid="send_form"
								aria-label="Soumettre le formulaire de création de ville"
								disabled={isDisabled}
								type="submit"
								variant="contained"
								color="primary"
								size="large"
								style={{ borderRadius: "24px" }}
							>
								Créer
							</Button>
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default NewCity;
