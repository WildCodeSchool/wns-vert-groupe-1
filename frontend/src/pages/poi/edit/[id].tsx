import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	Grid,
	Paper,
	TextField,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import styled from "@emotion/styled";
import axios from "axios";

import { EDIT_POI_BY_ID } from "@mutations";
import { GET_POI_BY_ID, GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { mainTheme } from "@theme";
import { CategoryType, CityInput, POIInput } from "@types";
import { useAuth } from "context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const EditPoiByID = () => {
	const router = useRouter();
	const id = router.query.id;

	const {
		data: poiData,
		error: poiError,
		loading: poiLoading,
	} = useQuery(GET_POI_BY_ID, {
		variables: { id: Number(id) },
	});

	const { data: cityData } = useQuery(GET_ALL_CITIES);
	const { data: categoryData } = useQuery(GET_ALL_CATEGORIES);

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
					console.log(response);
					return response.data.filename;
				} catch (err) {
					console.log("error", err);
					return null;
				}
			});

			Promise.all(uploadPromises).then((filenames) => {
				setForm((prev) => ({
					...prev,
					images: [
						...prev.images,
						...filenames.filter((filename) => filename !== null),
					],
				}));
			});
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
				id: Number(id),
			},
		});
		toast.success("POI updated successfully");
		router.push(`/poi/${id}`);
	} catch (error) {
		console.error("Error updating POI: ", error);
		toast.error("Error updating POI");
	}
};
    console.log(form)

	if (poiLoading || !cityData || !categoryData) return <p>Loading...</p>;
	if (poiError) return <p>Error loading POI data</p>;

	return (
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width={{ xs: "85%", lg: "60%" }}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Grid container spacing={6}>
				<Grid item >
					<Paper sx={{ padding: "1rem" }}>
						<Typography
							color={mainTheme.palette.primary.main}
							align="center"
							sx={{ fontSize: mainTheme.typography.h3, fontWeight: "bold" }}
						>
							Modifiier un POI
						</Typography>
						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								margin="normal"
								label="Nom"
								name="name"
								value={form.name}
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
								onChange={(e) =>
									setForm({ ...form, postalCode: e.target.value })
								}
							/>
							<TextField
								fullWidth
								margin="normal"
								label="Description"
								name="description"
								value={form.description}
                                multiline
                                minRows={4}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							<FormControl fullWidth margin="normal">
								<InputLabel id="city-label">Ville</InputLabel>
								<Select
									labelId="city-label"
									name="city"
									value={form.city}
									onChange={(e) => setForm({ ...form, city: e.target.value })}
									label="Ville"
								>
									{cityData.getAllCities.map((city: CityInput) => (
										<MenuItem key={city.id} value={city.id}>
											{city.name}
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
							/>
							<FormControl fullWidth margin="normal">
								<InputLabel id="category-label">Catégorie</InputLabel>
								<Select
									labelId="category-label"
									name="category"
									value={form.category}
									onChange={(e) =>
										setForm({ ...form, category: e.target.value })
									}
									label="Catégorie"
								>
									{categoryData.getAllCategories.map(
										(category: CategoryType) => (
											<MenuItem key={category.id} value={category.id}>
												{category.name}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									marginTop: "1rem",
								}}
							>
								<Typography variant="subtitle1">Images :</Typography>
								<Grid container spacing={2}>
									{form.images.map((image, index) => (
										<Grid item key={index}>
											<Box sx={{ position: "relative" }}>
												<img
													src={image}
													alt={`Image ${index}`}
													style={{ maxWidth: "100px", maxHeight: "100px" }}
												/>
												<Button
													variant="contained"
													color="secondary"
													size="small"
													sx={{ position: "absolute", top: 0, right: 0 }}
													onClick={() => handleImageDelete(index)}
												>
													X
												</Button>
											</Box>
										</Grid>
									))}
								</Grid>
							</Box>
							<Grid
								item
								xs={12}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginTop: "1rem",
								}}
							>
								<Button
									component="label"
									color="primary"
									role={undefined}
									variant="contained"
									tabIndex={-1}
									startIcon={<AddPhotoAlternateOutlinedIcon />}
								>
									Ajouter des images
									<input
										type="file"
										style={{ display: "none" }}
										onChange={handleImageUpload}
										multiple
									/>
								</Button>
							</Grid>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									marginTop: "1rem",
								}}
							>
								<Button
									variant="contained"
									color="primary"
									type="submit"
									disabled={loading}
								>
									{loading ? "Mise à jour en cours..." : "Modifier"}
								</Button>
							</Box>
						</form>
					</Paper>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default EditPoiByID;
