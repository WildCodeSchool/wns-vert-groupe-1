import { useMutation, useQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { GET_ALL_CITIES } from "@queries";
import { mainTheme } from "@theme";
import { errors, useAuth } from "../../../context";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_CITY_BY_ID } from "@mutations";
import { CityType } from "@types";
import { IconButton, RoundedBox } from "@components";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@components";
import { capitalizeFrenchName } from "utils";

const columns: { key: any; name: string }[] = [
	{
		key: "name",
		name: "Nom",
	},
	{
		key: "description",
		name: "Description",
	},
	{
		key: "lat",
		name: "Latitude",
	},
	{
		key: "lon",
		name: "Longitude",
	},
];

const CityList = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [open, setOpen] = React.useState<boolean>(false);

	const [selectedCity, setSelectedCity] = React.useState<CityType>();

	const {
		data: citiesData,
		loading: citiesLoading,
		error: citiesError,
		refetch,
	} = useQuery(GET_ALL_CITIES, {
		fetchPolicy: "cache-and-network",
	});

	const [deleteCity, { loading: deleteCityLoading, error: deleteCityError }] =
		useMutation(DELETE_CITY_BY_ID, {
			refetchQueries: [{ query: GET_ALL_CITIES }],
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
		if (citiesError) {
			toast.error(
				"Une erreur est survenue lors de la récupération des données."
			);
		}

		if (deleteCityError) {
			toast.error(
				"Une erreur est survenue lors de la suppression de la ville."
			);
		}
	}, [citiesError, deleteCityError]);

	const handleDeleteCity = (cityId: number) => {
		deleteCity({
			variables: { deleteCityByIdId: cityId },
		})
			.then(() => {
				refetch();
				setOpen(false);
				toast.success(`La ville ${selectedCity?.name} a bien été supprimée !`);
			})
			.catch((err) => {
				toast.error(
					`Une erreur est survenue lors de la suppression de la ville ${selectedCity?.name}.`
				);
				console.error(err);
			});
	};

	return isLoadingSession || citiesLoading ? (
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
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="h1"
							color={mainTheme.palette.primary.main}
							fontSize={mainTheme.typography.h3.fontSize}
							textTransform="uppercase"
						>
							VILLES
						</Typography>
						<IconButton
							aria-label="Ajouter une ville"
							data-testid="add_city_button"
							size={40}
							onClick={() => {
								router.push("new");
							}}
							icon={
								<AddIcon
									fontSize="large"
									titleAccess="Button ajouter une ville"
								/>
							}
						/>
					</Grid>
					<Grid item width="100%" display="flex" flexDirection="column">
						<Box
							sx={{
								overflowX: "auto",
								whiteSpace: "nowrap",
								width: "100%",
							}}
						>
							<Box
								display="flex"
								flex={1}
								flexDirection="row"
								gap={mainTheme.spacing(4)}
								minWidth={"1500px"}
							>
								<RoundedBox
									row
									color="transparent"
									width="85%"
									align="center"
									gap={mainTheme.spacing(8)}
									paddingX={mainTheme.spacing(2)}
								>
									{columns.map((column, index) => {
										return (
											<Box
												key={index}
												width={column.key === "description" ? "60%" : "20%"}
												maxWidth={
													column.key === "description" ? 600 : undefined
												}
												sx={{
													maxWidth: 600,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
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
								<Box width="15%" alignContent="center" textAlign="center">
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
								paddingY={10}
							>
								{citiesData?.getAllCities?.map(
									(city: CityType, index: number) => {
										return (
											<Box
												key={index}
												display="flex"
												flexDirection="row"
												gap={mainTheme.spacing(6)}
												minWidth="1500px"
											>
												<RoundedBox
													row
													key={index}
													align="center"
													gap={mainTheme.spacing(8)}
													width="85%"
													paddingX={mainTheme.spacing(2)}
												>
													<Box width="20%" minWidth={"200px"}>
														<Typography>
															{city.name ? capitalizeFrenchName(city.name) : ""}
														</Typography>
													</Box>
													<Box
														width="60%"
														sx={{
															maxWidth: 600,
															overflow: "hidden",
														}}
													>
														<Typography
															sx={{
																whiteSpace: "nowrap",
																overflow: "hidden",
																textOverflow: "ellipsis",
															}}
														>
															{city.description}
														</Typography>
													</Box>
													<Box width="20%" minWidth={"200px"}>
														<Typography>{city.lat}</Typography>
													</Box>
													<Box width="20%" minWidth={"200px"}>
														<Typography>{city.lon}</Typography>
													</Box>
												</RoundedBox>

												<Box
													textAlign="center"
													alignContent="center"
													alignItems="center"
													width="15%"
													minWidth={"150px"}
													display="flex"
													flexDirection="row"
													justifyContent="space-evenly"
												>
													<IconButton
														onClick={() => {
															router.push(`/admin/city/edit/${city.id}`);
														}}
														icon={<EditIcon fontSize="small" />}
													/>
													<IconButton
														onClick={() => {
															setSelectedCity(city);
															setOpen(true);
														}}
														icon={<DeleteIcon fontSize="small" />}
													/>
												</Box>
												<Modal
													open={open}
													setOpen={setOpen}
													onClose={() => {
														setSelectedCity(undefined);
														setOpen(false);
													}}
													onSubmit={() => {
														if (selectedCity?.id)
															handleDeleteCity(selectedCity.id);
													}}
													submitLabel={
														deleteCityLoading
															? "Confirmation en cours..."
															: "Confirmer"
													}
												>
													<Typography
														id="delete-city-modal-title"
														variant="h4"
														component="h2"
													>
														{`Voulez-vous vraiment supprimer la ville ${selectedCity?.name ? capitalizeFrenchName(selectedCity?.name) : ""} ?`}
													</Typography>
												</Modal>
											</Box>
										);
									}
								)}
							</Box>
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default CityList;
