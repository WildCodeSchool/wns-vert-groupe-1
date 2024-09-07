import {
	Typography,
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
import { BackButton, RoundedButton } from "@components";

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

const NewCity = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [createNewCity] = useMutation(CREATE_NEW_CITY, {
		onCompleted: () => {
			toast.success("La ville a été créée avec succès!");
			reset();
			router.push("/admin/city/list");
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
		clearErrors,
		formState: { errors },
	} = useForm<CityInput>({
		defaultValues: {
			name: "",
			description: "",
		},
		mode: "onBlur",
	});

	const watchedName = watch("name");
	const watchedDescription = watch("description");

	const isDisabled =
		!watchedName || !watchedDescription || Object.keys(errors).length > 0;

	const onSubmit: SubmitHandler<CityInput> = async (formData) => {
		const formattedName = formData.name.trim().toLocaleLowerCase();

		if (!errors.name && Object.keys(errors).length === 0) {
			await createNewCity({
				variables: { cityData: { ...formData, name: formattedName } },
			});
		}
	};

	const onBlur = async (cityName: string) => {
		if (cityName) {
			try {
				const { data } = await checkCityUnique({
					variables: { name: cityName },
				});
				if (data && data.isCityNameUnique === false) {
					setError("name", {
						type: "manual",
						message:
							"Ce nom de ville existe déjà. Veuillez en choisir un autre.",
					});
				} else {
					clearErrors("name");
				}
			} catch (error) {
				console.error(
					"Erreur lors de la vérification d'unicité du nom de ville",
					error
				);
			}
		} else {
			setError("name", {
				type: "manual",
				message: "Le nom de la ville est requis",
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
					padding={8}
					flex={1}
					flexDirection="column"
					alignItems="center"
					gap={mainTheme.spacing(8)}
				>
					<BackButton />
					<Grid
						item
						width="100%"
						direction="row"
						flexDirection="row"
						display="flex"
						paddingX={8}
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="h1"
							color={mainTheme.palette.primary.main}
							fontSize={mainTheme.typography.h3.fontSize}
							textTransform="uppercase"
						>
							Création d&apos;une nouvelle ville
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
							padding={5}
							gap={6}
						>
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
								sx={commonTextFieldStyles}
								onBlur={(e) => {
									onBlur(e.target.value.trim().toLocaleLowerCase());
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
								sx={commonTextFieldStyles}
							/>
							<RoundedButton
								data-testid="send_form"
								type="submit"
								disabled={isDisabled}
								label="Soumettre le formulaire de création de ville"
							>
								Créer
							</RoundedButton>
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default NewCity;
