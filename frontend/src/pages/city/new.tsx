import {
	Stack,
	Typography,
	Button,
	TextField,
	Paper,
	Box,
	Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { mainTheme } from "@theme";
import React from "react";
import { CREATE_NEW_CITY } from "@mutations";
import { useMutation } from "@apollo/client";
import { CityInput } from "@types";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import useWindowDimensions from "utils/windowDimensions";
import { toast } from "react-toastify";
import { ImagesCarousel } from "@components";
import { useAuth } from "context";
import { useRouter } from "next/navigation";

const defaultState: CityInput = {
	name: "",
	description: "",
	images: [],
};

const NewCity = () => {
	const { height, width } = useWindowDimensions();
	const { isAuthenticated } = useAuth();
	const [images, setImages] = React.useState<string[]>([]);
	const router = useRouter();
	const [form, setForm] = React.useState<CityInput>(defaultState);

	const [createNewCity, { data, loading, error }] =
		useMutation(CREATE_NEW_CITY);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setForm({
			...form,
			images: images.map((image) => "http://localhost:8000" + image),
		});
		createNewCity({
			variables: {
				cityData: {
					name: form.name.charAt(0).toUpperCase() + form.name.slice(1),
					description: form.description,
					images: form.images,
				},
			},
		})
			.then((res) => {
				console.log("res", res);
				toast.success(`La ville ${form.name} a été crée`);
			})
			.catch((e) => {
				console.log("Error : ", e);
				toast.error("Une erreur est survenue lors de la création de la ville");
			});
		setImages([]);
	};

	const handleFileChange = async (e: any) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			console.log("selectedFiles", selectedFiles);
			const url = "http://localhost:8000/upload";
			const uploadPromises = (selectedFiles as File[]).map(
				async (file: File) => {
					const formData = new FormData();
					console.log("formData", formData);
					formData.append("file", file, file.name);
					try {
						const response = await axios.post(url, formData);
						console.log("response", response);
						return response.data.filename;
					} catch (err) {
						console.log("error", err);
						return null;
					}
				}
			);

			Promise.all(uploadPromises).then((filenames) => {
				setImages((prevImageURLs) => [
					...prevImageURLs,
					...filenames.filter((filename) => filename !== null),
				]);
			});
		}
	};

	const isDisabled = React.useMemo(() => {
		return !(form.name && form.description);
	}, [form]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

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

	return isAuthenticated ? (
		<Stack
			flex={1}
			display="flex"
			alignItems="center"
			justifyContent="center"
			width={width}
			height={height - 120}
			// sx={{ backgroundColor: "black" }}
		>
			<Paper
				component={Box}
				elevation={5}
				square={false}
				sx={{
					display: "flex",
					flexDirection: "row",
					height: (height - 120) * 0.8,
					width: width * 0.8,
					alignItems: "center",
					justifyContent: "center",
					boxSizing: "border-box",
					overflow: "hidden",
				}}
			>
				<Grid
					container
					flex={1}
					width="100%"
					height="100%"
					flexWrap="wrap"
					flexDirection={{
						xs: "column-reverse",
						sm: "column-reverse",
						md: "row",
						lg: "row",
					}}
				>
					<Grid
						item
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={{ xs: 1 / 2, md: 1, lg: 1, xl: 1 }}
						width={{ xs: 1, md: 1, lg: 1 / 2, xl: 1 / 2 }}
						sx={{ backgroundColor: mainTheme.palette.primary.light }}
						// mainTheme.palette.primary.light
					>
						{images.length > 0 ? (
							<Box padding={4}>
								<ImagesCarousel
									images={images.map(
										(image) => `http://localhost:8000${image}`
									)}
								/>
							</Box>
						) : (
							<>
								<AddPhotoAlternateOutlinedIcon
									sx={{
										color: mainTheme.palette.primary.main,
										fontSize: "100px",
									}}
								/>
							</>
						)}
					</Grid>
					<Grid
						item
						height={{ xs: 1 / 2, md: 1, lg: 1, xl: 1 }}
						width={{ xs: 1, md: 1, lg: 1 / 2, xl: 1 / 2 }}
						display="flex"
						alignItems="center"
						justifyContent="center"
						gap={6}
						flexWrap="wrap"
					>
						<Box
							component="form"
							onSubmit={(e) => onSubmit(e)}
							flex={1}
							display="flex"
							flexDirection="column"
							justifyContent="space-evenly"
							alignItems="center"
							height="100%"
							padding={5}
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
								id="name"
								variant="standard"
								placeholder="Nom de la ville"
								required
								size="medium"
								fullWidth
								margin="normal"
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
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							<Button
								component="label"
								sx={{
									backgroundColor: mainTheme.palette.primary.light,
									color: mainTheme.palette.primary.main,
								}}
								variant="contained"
								tabIndex={-1}
								startIcon={<CloudUploadIcon />}
							>
								Ajouter des images
								<VisuallyHiddenInput
									type="file"
									onChange={(e) => handleFileChange(e)}
									multiple
								/>
							</Button>
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
		</Stack>
	) : (
		<Stack>
			<Typography>
				Vous devez être connecté pour accéder à cette page.
			</Typography>
		</Stack>
	);
};

export default NewCity;
