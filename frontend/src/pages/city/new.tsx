import {
	Stack,
	Typography,
	Button,
	TextField,
	ImageList,
	ImageListItem,
	Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { mainTheme } from "@theme";
import React from "react";
import { GeoCodingCityService } from "services/CityService";
import { CREATE_NEW_CITY } from "@mutations";
import { useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { CityInput } from "@types";
import Carousel from "react-material-ui-carousel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const defaultState: CityInput = {
	name: "",
	description: "",
	images: [],
};

const newCity = () => {
	const [selectedImageIndex, setSelectedImageIndex] = React.useState<
		number | null
	>(null);
	const [images, setImages] = React.useState<string[]>([]);
	const [form, setForm] = React.useState<CityInput>(defaultState);

	//TODO : gestion erreur
	const [createNewCity, { data, loading, error }] =
		useMutation(CREATE_NEW_CITY);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
		console.log(selectedImageIndex);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CityInput>();

	const onSubmit: SubmitHandler<CityInput> = async (form) => {
		try {
			console.log("submit");
			form.name = form.name.charAt(0).toUpperCase() + form.name.slice(1);
			const coordinates = await GeoCodingCityService.getCoordinates(form.name);

			createNewCity({
				variables: {
					cityData: {
						name: form.name,
						description: form.description,
						lat: coordinates?.latitude,
						lon: coordinates?.longitude,
						images: images.map((image) => "http://localhost:8000" + image),
					},
				},
			});
			setImages([]);
			reset();
		} catch (e) {
			console.error("Error : ", e);
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
	console.log("form", form);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "80vh",
			}}
		>
			<Stack
				width="90%"
				display="flex"
				direction="column"
				alignItems="center"
				justifyContent="center"
				spacing={5}
				height="100%"
				// sx={{ backgroundColor: "pink" }}
			>
				<Typography
					sx={{
						fontFamily: mainTheme.typography.fontFamily,
						color: mainTheme.palette.primary.main,
						fontSize: 26,
						fontWeight: mainTheme.typography.fontWeightBold,
						textTransform: "uppercase",
					}}
				>
					Créer une nouvelle ville
				</Typography>
				<Stack
					direction="row"
					spacing={5}
					marginY={5}
					width="90%"
					height="80%"
					// sx={{ backgroundColor: "pink" }}
				>
					<Stack
						direction="column"
						spacing={5}
						sx={{
							flex: 1,
							// backgroundColor: "pink",
						}}
					>
						{images.length > 0 ? (
							<>
								<Carousel
									autoPlay={true}
									index={
										selectedImageIndex !== null ? selectedImageIndex : undefined
									}
									sx={{ height: "70vh", backgroundcolor: "pink" }}
								>
									{images.map((image, i) => (
										<img
											key={i}
											src={"http://localhost:8000" + image}
											style={{
												width: "100%",
												// height: "100%",
												height: "55vh",
												objectFit: "cover",
												borderRadius: "45px",
											}}
										/>
									))}
								</Carousel>
								<ImageList cols={5}>
									{images.map((image, i) => (
										<ImageListItem
											key={i}
											onClick={() => handleImageClick(i)}
											// onClick={() => setSelectedImageIndex(i)}
										>
											<img
												src={"http://localhost:8000" + image}
												loading="lazy"
												style={{ borderRadius: "20px" }}
											/>
										</ImageListItem>
									))}
								</ImageList>
							</>
						) : (
							<></>
						)}

						<Stack justifyContent="end" display="flex" flex={1}>
							<Button
								component="label"
								color="primary"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								startIcon={<CloudUploadIcon />}
							>
								Ajouter des images
								<VisuallyHiddenInput
									type="file"
									onChange={async (e: any) => {
										if (e.target.files) {
											const selectedFiles = Array.from(e.target.files);
											const url = "http://localhost:8000/upload";

											const uploadPromises = (selectedFiles as File[]).map(
												async (file: File) => {
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
												}
											);

											Promise.all(uploadPromises).then((filenames) => {
												console.log("filenames", filenames);
												setImages((prevImages) => [
													...prevImages,
													...filenames.filter((filename) => filename !== null),
												]);
											});
										}
									}}
									multiple
								/>
							</Button>
						</Stack>
					</Stack>

					<Stack spacing={6} sx={{ flex: 1 }}>
						<Paper
							component="form"
							onSubmit={handleSubmit(onSubmit)}
							elevation={24}
							sx={{
								flex: 1,
								padding: mainTheme.spacing(3),
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
							<TextField
								id="name"
								variant="standard"
								placeholder="Nom de la ville"
								required
								size="medium"
								fullWidth
								margin="normal"
								{...register("name", {
									required: {
										value: true,
										message: "Ce champ est obligatoire",
									},
								})}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
							<TextField
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
									required: {
										value: true,
										message: "Ce champ est obligatoire",
									},
								})}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							<Button type="submit" variant="contained" color="primary">
								Créer
							</Button>
						</Paper>
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};

export default newCity;
