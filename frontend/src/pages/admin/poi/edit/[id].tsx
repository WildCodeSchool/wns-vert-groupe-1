import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Grid,
	TextField,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
	Button,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { EDIT_POI_BY_ID } from "@mutations";
import { GET_POI_BY_ID, GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { mainTheme } from "@theme";
import { CategoryType, CityType, POIInput } from "@types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { capitalizeFirstLetter, capitalizeFrenchName } from "utils";
import { BackButton, IconButton, RoundedButton } from "@components";
import CloseIcon from "@mui/icons-material/Close";

const EditPoiByID = () => {
	const router = useRouter();
	const id = router.query.id;

	const {
		data: poiData,
		error: poiError,
		loading: poiLoading,
	} = useQuery(GET_POI_BY_ID, {
		variables: { id: Number(id) },
		fetchPolicy: "cache-and-network",
	});

	const { data: cityData, loading: cityLoading } = useQuery(GET_ALL_CITIES);
	const { data: categoryData, loading: categoryLaoding } =
		useQuery(GET_ALL_CATEGORIES);

	const [editPoi, { data, error, loading }] = useMutation(EDIT_POI_BY_ID);

	const [form, setForm] = useState<POIInput>({
		name: "",
		address: "",
		postalCode: "",
		description: "",
		city: "",
		latitude: 0,
		longitude: 0,
		images: [],
		category: "",
	});

	useEffect(() => {
		if (poiData?.getPoiById) {
			setForm({
				name: poiData.getPoiById.name || "",
				address: poiData.getPoiById.address || "",
				postalCode: poiData.getPoiById.postalCode || "",
				description: poiData.getPoiById.description || "",
				city: poiData.getPoiById.city.id || "",
				latitude: poiData.getPoiById.latitude || 0,
				longitude: poiData.getPoiById.longitude || 0,
				images: poiData.getPoiById.images || [],
				category: poiData.getPoiById.category.id || "",
			});
		}
	}, [poiData]);

	const handleImageDelete = (index: number) => {
		const updatedImages = [...form.images];
		updatedImages.splice(index, 1);
		setForm((prev) => ({
			...prev,
			images: updatedImages,
		}));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			const url = "/upload";
			const uploadPromises = selectedFiles.map(async (file: File) => {
				const formData = new FormData();
				formData.append("file", file, file.name);
				try {
					const response = await axios.post(url, formData);
					return response.data.filename;
				} catch (err) {
					console.error("Error uploading image:", err);
					return null;
				}
			});
			const filenames = await Promise.all(uploadPromises);

			setForm((prev) => ({
				...prev,
				images: [
					...prev.images,
					...filenames.filter((filename) => filename !== null),
				],
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await editPoi({
				variables: {
					newPoiInput: {
						name: form.name,
						address: form.address,
						postalCode: form.postalCode,
						description: form.description,
						city: Number(form.city),
						latitude: form.latitude,
						longitude: form.longitude,
						images: form.images,
						category: Number(form.category),
					},
					updatePoiByIdId: Number(id),
				},
			});
			toast.success("Le POI a bien été mis à jour !");
			router.push(`/poi/${id}`);
		} catch (error) {
			console.error("Error updating POI: ", error);
			toast.error(
				`Une erreur est survenue lors de la modification du POI. ${error}`
			);
		}
	};

	if (poiError) return toast.error(`Une erreur est survenue.${poiError}`);

	return poiLoading || cityLoading || categoryLaoding ? (
		<CircularProgress />
	) : (
		<Grid container paddingX={10} paddingY={10}>
			<BackButton />
			<Grid item display="flex" flexDirection="column" gap={6} paddingX={6}>
				<Typography
					color={mainTheme.palette.primary.main}
					fontSize={mainTheme.typography.h3.fontSize}
				>
					Modifier un POI
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						fullWidth
						margin="normal"
						label="Nom"
						name="name"
						value={form?.name ? capitalizeFrenchName(form.name) : ""}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Adresse"
						name="address"
						value={form.address}
						onChange={(e) => setForm({ ...form, address: e.target.value })}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Code Postal"
						name="postalCode"
						value={form.postalCode}
						onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Description"
						name="description"
						value={form.description}
						multiline
						minRows={4}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel id="city-label">Ville</InputLabel>
						<Select
							labelId="city-label"
							name="city"
							value={form.city}
							onChange={(e) =>
								setForm({ ...form, city: Number(e.target.value) })
							}
							label="Ville"
							readOnly={true}
						>
							{cityData?.getAllCities?.map((city: CityType) => (
								<MenuItem key={city.id} value={city.id}>
									{city.name ? capitalizeFrenchName(city.name) : ""}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						fullWidth
						margin="normal"
						label="Latitude"
						name="latitude"
						type="number"
						value={form.latitude}
						onChange={(e) =>
							setForm({ ...form, latitude: Number(e.target.value) })
						}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Longitude"
						name="longitude"
						type="number"
						value={form.longitude}
						onChange={(e) =>
							setForm({ ...form, longitude: Number(e.target.value) })
						}
						InputProps={{
							readOnly: true,
						}}
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel id="category-label">Catégorie</InputLabel>
						<Select
							labelId="category-label"
							name="category"
							value={form.category}
							onChange={(e) =>
								setForm({ ...form, category: Number(e.target.value) })
							}
							label="Catégorie"
						>
							{categoryData?.getAllCategories?.map((category: CategoryType) => (
								<MenuItem key={category.id} value={category.id}>
									{capitalizeFirstLetter(category.name)}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box display="flex" flexDirection="column" marginTop="1rem" gap={4}>
						<Typography variant="subtitle1">Images :</Typography>
						<Grid
							container
							gridColumn={5}
							justifyContent="space-around"
							gap={4}
						>
							{form.images.map((image, index) => (
								<Grid item key={index}>
									<Box
										sx={{
											maxWidth: "300px",
											height: "200px",
											position: "relative",
											backgroundColor: "transparent",
										}}
									>
										<img
											src={image}
											alt={`Image ${index}`}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "10px",
											}}
										/>
										<IconButton
											icon={<CloseIcon />}
											color="secondary"
											onClick={() => handleImageDelete(index)}
											sx={{
												position: "absolute",
												top: 0,
												right: 0,
												borderRadius: "10px",
											}}
											rounded={false}
										/>
									</Box>
								</Grid>
							))}
						</Grid>
					</Box>
					<Grid
						item
						xs={12}
						display="flex"
						alignItems="center"
						justifyContent="center"
						gap={6}
						marginTop="1rem"
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
							<input
								type="file"
								style={{ display: "none" }}
								onChange={handleImageUpload}
								multiple
							/>
						</Button>
						<RoundedButton type="submit" disabled={loading}>
							{loading ? "Mise à jour en cours..." : "Modifier"}
						</RoundedButton>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
};

export default EditPoiByID;
