import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import { EDIT_CATEGORY_BY_ID, GET_CATEGORY_BY_ID } from "@mutations";
import { mainTheme } from "@theme";
import { CategoryInput } from "@types";
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

const EditCategoryByID = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();
	const { id } = router.query;

	const {
		data: categoryData,
		error: categoryError,
		loading: categoryLoading,
	} = useQuery(GET_CATEGORY_BY_ID, {
		variables: { getCategoryByIdId: Number(id) },
	});

	const [editCategory, { data, error, loading }] =
		useMutation(EDIT_CATEGORY_BY_ID);

	const [form, setForm] = React.useState<CategoryInput>({
		name: "",
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		editCategory({
			variables: {
				categoryData: {
					name: form.name,
				},
				updateCategoryByIdId: categoryData?.getCategoryById?.id,
			},
		})
			.then(() => {
				toast.success(
					`La catégorie ${capitalizeFirstLetter(form.name)} a bien été modifié.`
				);
				router.push(`/admin/category/list`);
			})
			.catch(() => {
				toast.error(
					"Une erreur est survenue lors de la modification de la catégorie"
				);
			});
	};

	useEffect(() => {
		if (error) {
			toast.error(
				"Erreur lors de la modification des données de la catégorie."
			);
		}
		if (categoryError) {
			toast.error(
				"Erreur lors de la récupération des données de la catégorie."
			);
		}
		if (categoryData?.getCategoryById) {
			setForm({
				name: categoryData.getCategoryById.name,
			});
		}
	}, [error, categoryError, categoryData]);

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

	return isLoadingSession || categoryLoading ? (
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
					Modification de la catégorie {categoryData?.name}
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
						onChange={(e) =>
							setForm({
								...form,
								name: e.target.value.trim().toLocaleLowerCase(),
							})
						}
						sx={commonTextFieldStyles}
					/>
					<RoundedButton
						type="submit"
						disabled={!form.name}
						label="Enregistrer les modifications"
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

export default EditCategoryByID;
