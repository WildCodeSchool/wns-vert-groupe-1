import { FormControl, IconButton, Stack, Typography } from "@mui/material";
import { mainTheme } from "@theme";
import { Button, Input } from "components/common";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import React, { ChangeEvent, FormEvent } from "react";
import { GeoCodingCityService } from "services/CityService";
import { CREATE_NEW_CITY } from "@mutations";
import { useMutation } from "@apollo/client";
// import { GeoCodingCityService } from "@services";
interface FormState {
	name: string;
	description: string;
}

const defaultState: FormState = {
	name: "",
	description: "",
};

const newCity = () => {
	const [file, setFile] = React.useState<string | undefined>();
	const [form, setForm] = React.useState<FormState>(defaultState);

	const [createNewCity, { data, loading, error }] =
		useMutation(CREATE_NEW_CITY);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.files);
		if (e.target.files && e.target.files[0]) {
			const fileUrl = URL.createObjectURL(e.target.files[0]);
			setFile(fileUrl);
		}
	};

	const handleChangeForm = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		// console.log(e.target.value);
		const { id, value } = e.target;
		console.log(id, value);
		setForm({ ...form, [id]: value });
	};

	const handleIconButtonClick = () => {
		const inputElement = document.getElementById(
			"icon-button-file"
		) as HTMLInputElement;
		inputElement.click();
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("submit");
		const coordinates = await GeoCodingCityService.getCoordinates(
			form.name.charAt(0).toUpperCase() + form.name.slice(1)
		);
		// console.log("coordinates", coordinates);
		console.log("form", form);
		createNewCity({
			variables: {
				cityData: {
					name: form.name,
					description: form.description,
					lat: coordinates?.latitude,
					lon: coordinates?.longitude,
					// images: imageURLs.map((image) => "http://localhost:8000" + image),
				},
			},
		});
	};

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
				width="100%"
				direction="column"
				alignItems="center"
				justifyContent="center"
				spacing={5}
				height="100%"
			>
				<Typography
					sx={{
						fontFamily: mainTheme.typography.fontFamily,
						color: mainTheme.palette.primary.dark,
						fontSize: 26,
						textTransform: "uppercase",
						fontStyle: "italic",
					}}
				>
					Créer une nouvelle ville
				</Typography>
				<Stack
					direction="row"
					spacing={5}
					marginY={5}
					width="100%"
					height="70%"
				>
					<Stack
						direction="column"
						spacing={5}
						sx={{
							flex: 1,
							// backgroundColor: "pink",
						}}
					>
						<Stack
							sx={{
								border: "solid",
								borderColor: mainTheme.palette.primary.main,
								borderWidth: 2,
								flex: 1,
								height: "70%",
								// backgroundColor: "red",
							}}
							alignItems="center"
							justifyContent="center"
						>
							{file ? (
								<>
									<img
										src={file}
										alt="selected image"
										style={{ width: "100%", height: "100%" }}
									/>
								</>
							) : (
								<>
									<IconButton onClick={handleIconButtonClick}>
										<AddPhotoAlternateOutlinedIcon
											style={{
												color: mainTheme.palette.primary.main,
												fontSize: 40,
											}}
										/>
									</IconButton>
								</>
							)}
						</Stack>
						<input type="file" onChange={handleImage} id="icon-button-file" />
					</Stack>

					<Stack
						direction="column"
						spacing={6}
						sx={{ flex: 1, backgroundColor: "pink" }}
					>
						<FormControl sx={{ flex: 1, columnGap: 20 }}>
							<Input
								id="name"
								variant="standard"
								placeholder="Nom de la ville"
								required
								onChange={handleChangeForm}
							/>
							<Input
								id="description"
								variant="standard"
								placeholder="Description"
								multiline
								rows={5}
								required
								onChange={handleChangeForm}
							/>
							<Button
								style={{
									width: 150,
									color: mainTheme.palette.primary.dark,
									backgroundColor: mainTheme.palette.primary.light,
								}}
								onClick={handleSubmit}
								size="medium"
							>
								Créer
							</Button>
						</FormControl>
					</Stack>
				</Stack>
			</Stack>
		</div>
		// </Stack>
	);
};

export default newCity;
