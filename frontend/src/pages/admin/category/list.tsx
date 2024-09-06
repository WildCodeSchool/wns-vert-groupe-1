import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { GET_ALL_CATEGORIES } from "@queries";
import { mainTheme } from "@theme";
import { errors, useAuth } from "../../../context";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_CATEGORY_BY_ID } from "@mutations";
import { CategoryType, CityType } from "@types";
import RoundedBox from "components/RoundedBox";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Modal } from "@components";
import { capitalizeFirstLetter } from "utils";

const columns: { key: any; name: string }[] = [
	{
		key: "name",
		name: "Nom",
	},
];

const CategoryList = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [open, setOpen] = React.useState<boolean>(false);

	const [selectedCategory, setSelectedCategory] = React.useState<CityType>();

	const {
		data: categoryData,
		loading: categoryLoading,
		error: categoryError,
	} = useQuery(GET_ALL_CATEGORIES, {
		fetchPolicy: "cache-and-network",
	});

	const [deleteCategory] = useMutation(DELETE_CATEGORY_BY_ID, {
		refetchQueries: [{ query: GET_ALL_CATEGORIES }],
	});

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

	React.useEffect(() => {
		if (categoryError) {
			toast.error(
				"Une erreur est survenue lors de la récupération des données."
			);
		}
	}, [categoryError]);

	const handleDeleteCategory = (categoryId: number) => {
		deleteCategory({
			variables: { deleteCategoryByIdId: categoryId },
		})
			.then(() => {
				setOpen(false);
				toast.success(
					`La catégorie ${selectedCategory?.name} a bien été supprimée !`
				);
			})
			.catch((err) => {
				toast.error(
					`Une erreur est survenue lors de la suppression de la catégorie ${selectedCategory?.name}.`
				);
				console.error(err);
			});
	};

	return isLoadingSession && categoryLoading ? (
		<CircularProgress />
	) : !isAuthenticated ? (
		<Typography>{errors.connected}</Typography>
	) : (
		<>
			{user?.role !== "ADMIN" ? (
				<Typography>{errors.role}</Typography>
			) : (
				<Grid
					container
					marginX={10}
					paddingX={10}
					paddingBottom={5}
					paddingTop={10}
					flex={1}
					flexDirection="column"
					gap={mainTheme.spacing(4)}
				>
					<Grid
						item
						width="100%"
						direction="row"
						flexDirection="row"
						display="flex"
						paddingX={4}
						justifyContent="space-between"
					>
						<Typography
							variant="h1"
							color={mainTheme.palette.primary.main}
							fontSize={mainTheme.typography.h3.fontSize}
							textTransform="uppercase"
						>
							Categories
						</Typography>
						<IconButton
							aria-label="Ajouter une catégorie"
							data-testid="add_city_button"
							size={40}
							onClick={() => {
								router.push("new");
							}}
							icon={
								<AddIcon fontSize="large" titleAccess="Ajouter une catégorie" />
							}
						/>
					</Grid>
					<Grid
						item
						width="100%"
						display="flex"
						flexDirection="column"
						flexGrow={1}
					>
						<Box
							width="100%"
							display="flex"
							flex={1}
							flexDirection="row"
							gap={mainTheme.spacing(4)}
							justifyContent="center"
							alignItems="center"
						>
							<RoundedBox row color="transparent" width="40%" align="center">
								{columns.map((column, index) => {
									return (
										<Box
											key={index}
											width={column.key === "description" ? "60%" : "100%"}
										>
											<Typography
												key={index}
												accessibility-label={column.key}
												fontWeight="bold"
											>
												{column.name}
											</Typography>
										</Box>
									);
								})}
							</RoundedBox>
							<Box width="20%" alignContent="center" textAlign="center">
								<Typography accessibility-label="actions" fontWeight="bold">
									Actions
								</Typography>
							</Box>
						</Box>
						<Box
							display="flex"
							flex={1}
							flexDirection="column"
							justifyContent="space-between"
							gap={mainTheme.spacing(6)}
						>
							{categoryData?.getAllCategories?.map(
								(category: CategoryType, index: number) => {
									return (
										<Box
											key={index}
											width="100%"
											display="flex"
											flex={1}
											flexDirection="row"
											gap={mainTheme.spacing(4)}
											justifyContent="center"
											alignItems="center"
										>
											<RoundedBox row key={index} align="center" width="40%">
												<Box width="100%">
													<Typography>
														{capitalizeFirstLetter(category.name)}
													</Typography>
												</Box>
											</RoundedBox>

											<Box
												textAlign="center"
												alignContent="center"
												alignItems="center"
												width="20%"
												display="flex"
												flexDirection="row"
												justifyContent="space-evenly"
											>
												<IconButton
													onClick={() => {
														router.push(`/admin/category/edit/${category.id}`);
													}}
													icon={<EditIcon fontSize="small" />}
												/>
												<IconButton
													onClick={() => {
														setSelectedCategory(category);
														setOpen(true);
													}}
													icon={<DeleteIcon fontSize="small" />}
												/>
											</Box>
											<Modal open={open} setOpen={setOpen}>
												<Typography
													id="delete-category-modal-title"
													variant="h4"
													component="h2"
												>
													{`Voulez-vous vraiment supprimer la catégorie ${selectedCategory?.name} ?`}
												</Typography>
												<Box gap={mainTheme.spacing(8)} display="flex">
													<Button
														aria-label="Annuler la suppression"
														sx={{ color: mainTheme.palette.error.main }}
														onClick={() => {
															setSelectedCategory(undefined);
															setOpen(false);
														}}
													>
														Annuler
													</Button>
													<Button
														aria-label="Confirmer la suppression"
														onClick={() => {
															if (selectedCategory?.id)
																handleDeleteCategory(
																	selectedCategory.id as number
																);
														}}
													>
														Confirmer
													</Button>
												</Box>
											</Modal>
										</Box>
									);
								}
							)}
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default CategoryList;
