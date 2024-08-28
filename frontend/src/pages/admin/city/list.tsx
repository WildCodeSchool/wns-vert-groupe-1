import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { GET_ALL_CITIES } from "@queries";
import { mainTheme } from "@theme";
import { errors, useAuth } from "../../../context";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_CITY_BY_ID } from "@mutations";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { CityType } from "@types";
import RoundedBox from "components/RoundedBox";
import { BackButton } from "@components";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	bgcolor: "background.paper",
	borderRadius: "2rem",
	border: "2px solid white",
	p: 7,
	gap: 5,
};

const CityList = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [open, setOpen] = React.useState<boolean>(false);

	const [city, setCity] = React.useState<CityType>();

	const {
		data: citiesData,
		loading: citiesLoading,
		error: citiesError,
		refetch,
	} = useQuery(GET_ALL_CITIES, {
		fetchPolicy: "cache-and-network",
	});

	const [deleteCity, { error: deleteCityError }] =
		useMutation(DELETE_CITY_BY_ID);

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

	return isLoadingSession ? (
		<CircularProgress />
	) : !isAuthenticated ? (
		<Typography>{errors.connected}</Typography>
	) : (
		<>
			{user?.role !== "ADMIN" ? (
				<Typography>{errors.role}</Typography>
			) : (
				<Grid
					paddingX={10}
					container
					flex={1}
					flexDirection="column"
					alignItems="center"
					gap={mainTheme.spacing(6)}
				>
					<BackButton />
					<Grid item width="100%" display="flex" paddingX={8}>
						<RoundedBox
							color={mainTheme.palette.primary.main}
							justify="space-between"
							row
						>
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
								alignContent="center"
							>
								Liste des villes :
							</Typography>
							<AddCircleIcon
								aria-label="Ajouter une ville"
								data-testid="add_city_button"
								onClick={() => router.push("new")}
								sx={{
									color: mainTheme.palette.primary.light,
									fontSize: "50px",
									cursor: "pointer",
								}}
							/>
						</RoundedBox>
					</Grid>
					{citiesData?.getAllCities?.length > 0 ? (
						<>
							<Grid item width="95%" mx="auto">
								{citiesLoading ? (
									<CircularProgress />
								) : (
									<TableContainer id="city-list" sx={{ borderRadius: "1rem" }}>
										<Table
											aria-label="Liste des villes sous format tableau"
											sx={{
												minWidth: 650,
												borderRadius: "1rem",
											}}
										>
											<TableHead>
												<TableRow
													sx={{
														backgroundColor: "white",
														borderRadius: "1rem 1rem 0 0",
													}}
												>
													<TableCell align="center">Nom</TableCell>
													<TableCell align="center">Description</TableCell>
													<TableCell align="center">Latitude</TableCell>
													<TableCell align="center">Longitude</TableCell>
													<TableCell
														sx={{
															borderRadius: "0 1rem 0 0",
														}}
														align="center"
													>
														Actions
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{citiesData?.getAllCities?.map((city: CityType) => {
													return (
														<TableRow
															key={city.name}
															sx={{
																backgroundColor: "white",
																borderRadius: "1rem",
																marginBottom: "16px",
																"&:nth-of-type(odd)": {
																	backgroundColor:
																		mainTheme.palette.primary.light,
																},
															}}
														>
															<TableCell align="center">{city.name}</TableCell>
															<TableCell
																sx={{
																	maxWidth: 300,
																	whiteSpace: "nowrap",
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																}}
																align="center"
															>
																{city?.description}
															</TableCell>
															<TableCell align="center">{city?.lat}</TableCell>
															<TableCell align="center">{city?.lon}</TableCell>

															<TableCell
																sx={{
																	borderLeft: "none",
																	borderRight: "1rem",
																}}
																align="center"
															>
																<Box
																	display="flex"
																	flexDirection="row"
																	justifyContent="space-evenly"
																	alignContent="center"
																	gap={mainTheme.spacing(2)}
																>
																	<RemoveRedEyeIcon
																		sx={{
																			color: mainTheme.palette.primary.main,
																			fontSize: "25px",
																			cursor: "pointer",
																		}}
																		onClick={() => {
																			router.push(`/admin/city/${city.id}`);
																		}}
																	/>
																	<EditIcon
																		sx={{
																			color: mainTheme.palette.primary.main,
																			fontSize: "25px",
																			cursor: "pointer",
																		}}
																		onClick={() =>
																			router.push(`/admin/city/edit/${city.id}`)
																		}
																	/>
																	<DeleteIcon
																		sx={{
																			color: mainTheme.palette.primary.main,
																			fontSize: "25px",
																			cursor: "pointer",
																		}}
																		onClick={() => {
																			setOpen(true);
																			setCity(city);
																		}}
																	/>
																</Box>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</TableContainer>
								)}
								<Modal
									key={city?.id}
									open={open}
									onClose={() => setOpen(false)}
									aria-labelledby="delete-city-modal-title"
								>
									<Box sx={style}>
										<Typography
											id="delete-city-modal-title"
											variant="h4"
											component="h2"
										>
											{`Voulez-vous vraiment supprimer la ville ${city?.name} ?`}
										</Typography>
										<Box gap={mainTheme.spacing(8)} display="flex">
											<Button
												aria-label="Confirmer la suppression"
												onClick={() => {
													deleteCity({
														variables: { deleteCityByIdId: city?.id },
													}).then((res) => {
														refetch();
														setOpen(false);
														toast.success(
															`La ville ${city?.name} a bien été supprimée !`
														);
													});
												}}
											>
												Confirmer
											</Button>
											<Button
												aria-label="Annuler la suppression"
												sx={{ color: mainTheme.palette.error.main }}
												onClick={() => setOpen(false)}
											>
												Annuler
											</Button>
										</Box>
									</Box>
								</Modal>
							</Grid>
						</>
					) : (
						<></>
					)}
				</Grid>
			)}
		</>
	);
};

export default CityList;
