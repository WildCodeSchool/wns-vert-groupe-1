import { useMutation, useLazyQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { GET_ALL_POIS } from "@queries";
import { DELETE_POI_BY_ID } from "@mutations";
import { mainTheme } from "@theme";
import { errors, useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { PoiType } from "@types";
import AddIcon from "@mui/icons-material/Add";
import { capitalizeFirstLetter } from "utils";
import { Modal, RoundedBox, IconButton } from "@components";

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
		key: "address",
		name: "Adresse",
	},
	{
		key: "postalCode",
		name: "Code postal",
	},
	{
		key: "city",
		name: "Ville",
	},
	{
		key: "category",
		name: "Catégorie",
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

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	p: 4,
};

const POIList = () => {
	const router = useRouter();
	const { isAuthenticated, isLoadingSession, user } = useAuth();

	const [open, setOpen] = React.useState<boolean>(false);

	const [getPOIS, { data: poisData, loading, error }] = useLazyQuery(
		GET_ALL_POIS,
		{
			fetchPolicy: "cache-and-network",
		}
	);
	const [selectedPOI, setSelectedPOI] = React.useState<PoiType>();

	const [deletePOI] = useMutation(DELETE_POI_BY_ID, {
		refetchQueries: [{ query: GET_ALL_POIS }],
	});

	React.useEffect(() => {
		if (error) {
			toast.error(
				"Une erreur est survenue lors de la récupération des données de POI."
			);
		}
	}, [error]);

	const handleDeletePOI = (poi: PoiType) => {
		deletePOI({
			variables: { id: poi.id },
		})
			.then(() => {
				setOpen(false);
				toast.success(
					`Le point d'intérêt ${selectedPOI?.name} a bien été supprimée !`
				);
			})
			.catch((err) => {
				toast.error(
					`Une erreur est survenue lors de la suppression du POI ${selectedPOI?.name}.`
				);
				console.error(err);
			});
	};

	React.useLayoutEffect(() => {
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			} else {
				if (user?.role === "USER") {
					router.replace("/");
				} else {
					const variables =
						user?.role !== "ADMIN" ? { city: user?.city?.id } : {};
					getPOIS({
						variables,
					});
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isLoadingSession, user?.role]);

	return loading ? (
		<CircularProgress />
	) : user?.role !== "USER" ? (
		<>
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
						point d&apos;intérêts
					</Typography>
					<IconButton
						aria-label="Ajouter un POI"
						data-testid="add_poi_button"
						size={40}
						onClick={() => {
							router.push("new");
						}}
						icon={<AddIcon fontSize="large" titleAccess="Ajouter un POI" />}
					/>
				</Grid>
				<Grid item width="100%" display="flex" flexDirection="column">
					<Box
						display="flex"
						flex={1}
						flexDirection="row"
						gap={mainTheme.spacing(4)}
					>
						<RoundedBox
							row
							color="transparent"
							width="85%"
							align="center"
							gap={mainTheme.spacing(4)}
							paddingX={mainTheme.spacing(2)}
						>
							{columns.map((column, index) => {
								return (
									<Box
										key={index}
										width={
											column.key === "description"
												? "30%"
												: column.key === "address" || column.key === "name"
													? "15%"
													: "10%"
										}
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
						{user?.role !== "SUPERUSER" ? (
							<Box width="10%" alignContent="center" textAlign="center">
								<Typography accessibility-label="actions" fontWeight="bold">
									Actions
								</Typography>
							</Box>
						) : (
							<></>
						)}
					</Box>
					<Box
						display="flex"
						flex={1}
						flexDirection="column"
						justifyContent="space-between"
						gap={mainTheme.spacing(6)}
						paddingY={10}
					>
						{poisData?.getAllPois?.map((poi: PoiType, index: number) => {
							return (
								<Box
									key={index}
									display="flex"
									flexDirection="row"
									gap={mainTheme.spacing(6)}
								>
									<RoundedBox
										row
										key={index}
										align="center"
										gap={mainTheme.spacing(4)}
										width="85%"
										paddingX={mainTheme.spacing(2)}
									>
										<Box width="15%">
											<Typography>
												{poi?.name ? capitalizeFirstLetter(poi.name) : ""}
											</Typography>
										</Box>
										<Box
											width="30%"
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
												{poi.description}
											</Typography>
										</Box>
										<Box width="15%">
											<Typography>{poi.address}</Typography>
										</Box>
										<Box width="10%">
											<Typography>{poi.postalCode}</Typography>
										</Box>
										<Box width="10%">
											<Typography>
												{poi?.city?.name
													? capitalizeFirstLetter(poi.city.name)
													: ""}
											</Typography>
										</Box>
										<Box width="10%">
											<Typography>
												{poi.category?.name
													? capitalizeFirstLetter(poi.category.name)
													: ""}
											</Typography>
										</Box>
										<Box width="10%">
											<Typography>{poi.latitude}</Typography>
										</Box>
										<Box width="10%">
											<Typography>{poi.longitude}</Typography>
										</Box>
									</RoundedBox>
									{user?.role !== "SUPERUSER" ? (
										<Box
											textAlign="center"
											alignContent="center"
											alignItems="center"
											width="10%"
											display="flex"
											flexDirection="row"
											justifyContent="space-evenly"
										>
											<IconButton
												onClick={() => {
													router.push(`/admin/poi/edit/${poi.id}`);
												}}
												icon={<EditIcon fontSize="small" />}
											/>
											<IconButton
												onClick={() => {
													setSelectedPOI(poi);
													setOpen(true);
												}}
												icon={<DeleteIcon fontSize="small" />}
											/>
										</Box>
									) : (
										<></>
									)}
									<Modal
										open={open}
										setOpen={setOpen}
										onClose={() => {
											setSelectedPOI(undefined);
											setOpen(false);
										}}
										onSubmit={() => {
											if (selectedPOI?.id) handleDeletePOI(selectedPOI);
										}}
										submitLabel={
											!loading ? "Confirmer" : "Confirmation en cours..."
										}
									>
										<Typography
											id="delete-poi-modal-title"
											variant="h4"
											component="h2"
										>
											{`Voulez-vous vraiment supprimer le POI : ${selectedPOI?.name} ?`}
										</Typography>
									</Modal>
								</Box>
							);
						})}
					</Box>
				</Grid>
			</Grid>
		</>
	) : (
		<Typography>{errors.role}</Typography>
	);
};

export default POIList;
