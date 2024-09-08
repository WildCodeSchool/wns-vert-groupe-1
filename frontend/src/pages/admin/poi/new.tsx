import { useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import {
	TextField,
	Select,
	MenuItem,
	Grid,
	InputLabel,
	Typography,
	FormControl,
	Box,
	Button,
	FormHelperText,
} from "@mui/material";
import { mainTheme } from "@theme";
import { CREATE_NEW_POI } from "@mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { CategoryType, CityType, POIInput } from "@types";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { BackButton, ImagesCarousel, RoundedButton } from "@components";
import { capitalizeFirstLetter, capitalizeFrenchName } from "utils";
import { useAuth } from "../../../context";
import React from "react";

const NewPoi = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const [imageURLs, setImageURLs] = useState<string[]>([]);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<POIInput>({ mode: "onBlur" });

	const { data: cityData } = useQuery<{
		getAllCities: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CITIES, { fetchPolicy: "cache-and-network" });

	const { data: categoryData } = useQuery<{
		getAllCategories: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CATEGORIES, { fetchPolicy: "cache-and-network" });

	const [createNewPoi, { loading }] = useMutation(CREATE_NEW_POI);

	const watchedName = watch("name");
	const watchedDescription = watch("description");
	const watchedAddress = watch("address");
	const watchedCodePostal = watch("postalCode");
	const watchedCity = watch("city");
	const watchedCategory = watch("category");

	const isDisabled =
		!watchedName ||
		!watchedDescription ||
		!watchedAddress ||
		!watchedCategory ||
		!watchedCity ||
		!watchedCodePostal;

	const validateImages = (images: string[]) => {
		if (images.length < 5) {
			toast.error("Au moins cinq images sont requises.");
			return false;
		}

		const imagePattern = /\.(jpg|jpeg|png)$/i;

		const invalidImage = images
			.map((image) => !imagePattern.test(image))
			.some((isInvalid) => isInvalid);

		if (invalidImage) {
			toast.error(
				"Les images téléchargés ne sont pas au bon format (les formats d'image supportés sont les suivants : JPEG, JPG ou PNG)."
			);
			return false;
		}

		return true;
	};

	const onSubmit: SubmitHandler<POIInput> = async (formData: POIInput) => {
		if (!validateImages(imageURLs)) {
			return;
		}

		try {
			const result = await createNewPoi({
				variables: {
					poiData: {
						name: formData.name,
						address: formData.address,
						postalCode: formData.postalCode,
						description: formData.description,
						images: imageURLs.map((image) => image),
						city: Number(formData.city),
						category: formData.category,
					},
				},
			});
			toast.success("POI a été crée avec succès!");
			setImageURLs([]);
			reset();
			router.push(`/poi/${result.data.createNewPoi.id}`);
		} catch (err: any) {
			toast.error(
				"Une erreur est survenue lors de la soumission du formulaire."
			);
			console.error("Form submission error:", err, err.message);
		}
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

	useLayoutEffect(() => {
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			} else {
				if (user?.role === "USER") {
					router.replace("/");
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingSession, isAuthenticated, user?.role]);

	return (
		<Grid container padding={8} flex={1} display="flex" flexDirection={"row"}>
			<BackButton />
			<Grid
				item
				xs={12}
				md={6}
				paddingX={2}
				display="flex"
				justifyContent="center"
				alignItems="center"
				bgcolor={mainTheme.palette.primary.light}
				borderRadius="45px"
			>
				{imageURLs.length > 0 ? (
					<Box>
						<ImagesCarousel
							images={imageURLs.map((image) => `${image}`)}
							isEditable
						/>
					</Box>
				) : (
					<AddPhotoAlternateOutlinedIcon
						sx={{
							color: mainTheme.palette.primary.main,
							fontSize: "100px",
						}}
					/>
				)}
			</Grid>
			<Grid item xs={12} md={6} padding={8}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)}>
					<Typography
						color={mainTheme.palette.primary.main}
						align="center"
						fontSize={mainTheme.typography.h4.fontSize}
						textTransform="uppercase"
					>
						Ajouter un POI
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label="Nom"
								{...register("name", {
									required: "Le nom est réquis",
									minLength: {
										value: 1,
										message: "Le nom doit comporter au moins 1 caractère",
									},
									maxLength: {
										value: 100,
										message: "Le nom doit comporter au moins 100 caractères",
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
								variant="standard"
								fullWidth
								margin="normal"
								size="small"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Adresse"
								{...register("address", {
									required: "L'adresse est réquise.",
									minLength: {
										value: 5,
										message: "L'adresse doit comporter au moins 5 caractères.",
									},
								})}
								error={!!errors.address}
								helperText={errors.address?.message}
								variant="standard"
								fullWidth
								margin="normal"
								size="small"
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								label="Code Postal"
								{...register("postalCode", {
									required: "Le code postal est réquis.",
									pattern: {
										value: /^\d{5}$/,
										message: "Format de code postal invalide.",
									},
								})}
								error={!!errors.postalCode}
								helperText={errors.postalCode?.message}
								variant="standard"
								fullWidth
								margin="normal"
								size="small"
							/>
						</Grid>
						<Grid item xs={4}>
							<FormControl
								fullWidth
								margin="normal"
								size="small"
								error={!!errors.city}
							>
								<InputLabel id="city">Ville</InputLabel>
								<Select
									label="Ville"
									labelId="city"
									{...register("city", {
										required: "Une ville doit être sélectionnée.",
									})}
									defaultValue=""
									fullWidth
									color="primary"
									value={
										user?.role === "SUPERUSER" || user?.role === "CITYADMIN"
											? String(user?.city?.id as unknown)
											: undefined
									}
									readOnly={
										user?.role === "SUPERUSER" || user?.role === "CITYADMIN"
											? true
											: false
									}
								>
									{cityData?.getAllCities?.map((city: CityType) => (
										<MenuItem key={city.id} value={city.id}>
											{city.name ? capitalizeFrenchName(city.name) : ""}
										</MenuItem>
									))}
								</Select>
								{errors.city && (
									<FormHelperText sx={{ color: "error.main" }}>
										{errors.city.message}
									</FormHelperText>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={4}>
							<FormControl
								fullWidth
								margin="normal"
								size="small"
								error={!!errors.category}
							>
								<InputLabel id="category">Catégorie</InputLabel>
								<Select
									label="Catégorie"
									labelId="category"
									{...register("category", {
										required: "Une category doit être sélectionnée",
									})}
									defaultValue=""
									fullWidth
									color="primary"
								>
									{categoryData?.getAllCategories?.map(
										(category: CategoryType) => (
											<MenuItem key={category.id} value={category.id}>
												{capitalizeFirstLetter(category.name)}
											</MenuItem>
										)
									)}
								</Select>
								{errors.category && (
									<FormHelperText sx={{ color: "error.main" }}>
										{errors.category.message}
									</FormHelperText>
								)}
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Description"
								multiline
								rows={3}
								{...register("description", {
									required: "La description est requise",
									minLength: {
										value: 50,
										message:
											"La description doit comporter au moins 50 caractères",
									},
								})}
								helperText={errors.description?.message}
								error={!!errors.description}
								fullWidth
								variant="standard"
								margin="normal"
							/>
						</Grid>

						<Grid
							item
							xs={12}
							sx={{
								display: "flex",
								marginTop: "1rem",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Button
								component="label"
								color="primary"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								size="large"
								startIcon={<AddPhotoAlternateOutlinedIcon />}
								style={{
									borderRadius: "24px",
									cursor: "pointer",
									margin: "16px",
								}}
							>
								Ajouter des images
								<VisuallyHiddenInput
									type="file"
									onChange={async (e: any) => {
										if (e.target.files) {
											const selectedFiles = Array.from(e.target.files);
											if (selectedFiles.length !== 5) {
												toast.error(
													"Veuillez sélectionner exactement cinq images."
												);
												return;
											}
											const url = "/upload";
											const uploadPromises = (selectedFiles as File[]).map(
												async (file: File) => {
													const formData = new FormData();
													formData.append("file", file, file.name);
													try {
														const response = await axios.post(url, formData);
														return response.data.filename;
													} catch (err) {
														console.error("Error uploading image:", err);
														return null;
													}
												}
											);

											Promise.all(uploadPromises).then((filenames) => {
												setImageURLs((prevImageURLs) => [
													...prevImageURLs,
													...filenames.filter((filename) => filename !== null),
												]);
											});
										}
									}}
									multiple
								/>
							</Button>
							<RoundedButton type="submit" disabled={isDisabled}>
								{!loading ? "Valider" : "Enregistrement en cours..."}
							</RoundedButton>
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
};

export default NewPoi;
