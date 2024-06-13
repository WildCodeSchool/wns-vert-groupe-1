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

//TODO : input validation
const NewCity = () => {
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
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width="80%"
			height={window.innerHeight * 0.7}
			overflow="auto"
			maxHeight="100vh"
			display="flex"
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
		>
			<Grid
				container
				flex={1}
				width="100%"
				height="100%"
				alignItems="stretch"
				flexWrap="nowrap"
				sx={{
					overflowY: "auto",
					maxHeight: "100vh",
				}}
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
					width="100%"
					height="100%"
					sx={{ backgroundColor: mainTheme.palette.primary.light }}
				>
					{images.length > 0 ? (
						<Box padding={4}>
							<ImagesCarousel
								images={images.map((image) => `http://localhost:8000${image}`)}
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
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
					flexWrap="nowrap"
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
							onChange={(e) => setForm({ ...form, name: e.target.value })}
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
	) : (
		<Typography>Vous devez être connecté pour accéder à cette page.</Typography>
	);
};

export default NewCity;
