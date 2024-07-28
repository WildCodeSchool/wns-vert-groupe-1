import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { EDIT_CITY_BY_ID } from "@mutations";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { CityInput } from "@types";
import { errors, useAuth } from "../../../context";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import RoundedBox from "components/RoundedBox";
import { BackButton } from "@components";

const EditCityByID = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();
	const { id } = router.query;

	const {
		data: cityData,
		error: cityError,
		loading: cityLoading,
	} = useQuery(GET_CITY_BY_ID, {
		variables: { getCityByIdId: Number(id) },
	});

	const [editCity, { data, error, loading }] = useMutation(EDIT_CITY_BY_ID);

	const [form, setForm] = React.useState<CityInput>({
		name: "",
		description: "",
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		editCity({
			variables: {
				cityData: {
					name: form.name.charAt(0).toUpperCase() + form.name.slice(1),
					description: form.description,
				},
				updateCityId: cityData?.getCityById?.id,
			},
		})
			.then((res: any) => {
				toast.success(`La ville ${form.name} a bien été modifié.`);
				router.push(`/city/${res?.data?.updateCity?.id}`);
			})
			.catch(() => {
				toast.error(
					"Une erreur est survenue lors de la modification de la ville"
				);
			});
	};

	const isDisabled = React.useMemo(() => {
		return !(form.name && form.description);
	}, [form]);

	useEffect(() => {
		if (error) {
			toast.error("Erreur lors de la modification des données de la ville.");
		}
		if (cityError) {
			toast.error("Erreur lors de la récupération des données de la ville.");
		}
		if (cityData?.getCityById) {
			setForm({
				name: cityData.getCityById.name,
				description: cityData.getCityById.description,
			});
		}
	}, [error, cityError, cityData]);

	React.useLayoutEffect(() => {
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			} else {
				if (user?.role !== "ADMIN") {
					router.replace("/");
				}
			}
		}
	}, [isAuthenticated, isLoadingSession, user?.role]);

	return isLoadingSession || cityLoading ? (
		<CircularProgress />
	) : !isAuthenticated ? (
		<Typography>{errors.connected}</Typography>
	) : user?.role === "ADMIN" ? (
		<Grid container flex={1} paddingX={10} direction="column">
			<BackButton />
			<Grid item flex={1}>
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
					gap={4}
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
							Modification de la ville {cityData?.name}
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
						value={form.name ?? form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						sx={{
							"& .MuiInputBase-root": {
								backgroundColor: "white",
								borderRadius: "2rem",
								paddingX: "1rem",
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
						value={form?.description ?? form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						sx={{
							"& .MuiInputBase-root": {
								backgroundColor: "white",
								borderRadius: "2rem",
								paddingX: "1rem",
							},
						}}
					/>
					<Button
						disabled={isDisabled}
						type="submit"
						variant="contained"
						color="primary"
					>
						{loading ? "Enregistrer " : "Enregistrement en cours ..."}
					</Button>
				</Box>
			</Grid>
		</Grid>
	) : (
		<Typography>{errors.role}</Typography>
	);
};

export default EditCityByID;
