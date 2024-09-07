import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { EDIT_CITY_BY_ID } from "@mutations";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { CityInput } from "@types";
import { errors, useAuth } from "context";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "utils";
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
					name: form.name.trim().toLocaleLowerCase(),
					description: form.description,
				},
				updateCityId: cityData?.getCityById?.id,
			},
		})
			.then((res: any) => {
				toast.success(
					`La ville ${capitalizeFirstLetter(form.name)} a bien été modifié.`
				);
				router.push(`/admin/city/list`);
			})
			.catch(() => {
				toast.error(
					`Une erreur est survenue lors de la modification de la ville ${capitalizeFirstLetter(form.name)}`
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isLoadingSession, user?.role]);

	return isLoadingSession || cityLoading ? (
		<CircularProgress />
	) : !isAuthenticated ? (
		<Typography>{errors.connected}</Typography>
	) : user?.role === "ADMIN" ? (
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
					Modification de la ville {cityData?.name}
				</Typography>
			</Grid>
			<Grid item width="100%" paddingX={4}>
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
					<TextField
						data-testid="input_name"
						id="name"
						variant="outlined"
						placeholder="Nom de la ville *"
						required
						size="medium"
						fullWidth
						margin="normal"
						value={form?.name ? capitalizeFirstLetter(form.name) : ""}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						sx={commonTextFieldStyles}
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
						sx={commonTextFieldStyles}
					/>
					<RoundedButton
						label="Enregistrer les modifications"
						disabled={isDisabled}
						type="submit"
					>
						{!loading ? "Enregistrer " : "Enregistrement en cours ..."}
					</RoundedButton>
				</Box>
			</Grid>
		</Grid>
	) : (
		<Typography>{errors.role}</Typography>
	);
};

export default EditCityByID;
