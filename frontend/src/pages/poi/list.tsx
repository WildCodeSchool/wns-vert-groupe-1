import { useQuery, useMutation } from "@apollo/client";
import {
	Box,
	Button,
	Grid,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import { GET_ALL_POIS } from "@queries";
import { DELETE_POI_BY_ID } from "@mutations";
import { mainTheme } from "@theme";
import { useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { PoiType } from "@types";

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
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const [open, setOpen] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [count, setCount] = React.useState<number>(0);
	const [poi, setPOI] = React.useState<PoiType>();

	const {
		data: poisData,
		loading: poisLoading,
		error: poisError,
		refetch,
	} = useQuery(GET_ALL_POIS, {
		variables: { offset: page * rowsPerPage, limit: rowsPerPage },
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "cache-and-network",
	});

	const [
		deletePOI,
		{ data: deletePOIData, loading: deletePOILoading, error: deletePOIError },
	] = useMutation(DELETE_POI_BY_ID);

	React.useEffect(() => {
		if (poisData?.getAllPOIs) {
			setCount(poisData?.getAllPOIs.length + 1);
		}
	}, [poisData]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		console.log("page", page, "newPage", newPage);
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		console.log("rowPerPage", rowsPerPage);
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	React.useEffect(() => {
		if (poisError) {
			toast.error(
				"Une erreur est survenue lors de la récupération des données."
			);
		}

		if (deletePOIError) {
			toast.error("Une erreur est survenue lors de la suppression du POI.");
		}
	}, [poisError, deletePOIError]);

	return (
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width="80%"
			height={window.innerHeight * 0.7}
			mx="auto"
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Grid
				container
				width="100%"
				display="flex"
				flexDirection="column"
				alignContent="flex-start"
				gap={mainTheme.spacing(6)}
			>
				<Grid
					item
					width="100%"
					display="flex"
					sx={{
						backgroundColor: mainTheme.palette.primary.light,
					}}
				>
					<Box
						flex={1}
						display="flex"
						alignContent="center"
						flexDirection="row"
						justifyContent="space-between"
						padding={mainTheme.spacing(6)}
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
							alignContent="center"
						>
							Liste des POIs :
						</Typography>
						<AddCircleIcon
							onClick={() => router.push("/poi/new")}
							sx={{
								color: mainTheme.palette.primary.main,
								fontSize: "50px",
								cursor: "pointer",
							}}
						/>
					</Box>
				</Grid>
				{poisData?.getAllPOIs?.length > 0 ? (
					<>
						<Grid item width="95%" mx="auto">
							<TableContainer component={Paper}>
								<Table
									sx={{
										minWidth: 650,
										border: `2px solid ${mainTheme.palette.primary.main}`,
										borderRadius: "20rem",
										"& .MuiTableHead-root": {
											backgroundColor: ` ${mainTheme.palette.primary.light}`,
										},
									}}
									aria-label="simple table"
								>
									<TableHead>
										<TableRow>
											<TableCell align="center">Nom</TableCell>
											<TableCell align="center">Description</TableCell>
											<TableCell align="center">Adresse</TableCell>
											<TableCell align="center">Code Postal</TableCell>
											<TableCell align="center">Ville</TableCell>
											<TableCell align="center">Catégorie</TableCell>
											<TableCell align="center">Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{poisData?.getAllPOIs?.map(
											(poi: PoiType, index: number) => {
												if (index < rowsPerPage) {
													return (
														<TableRow
															key={poi.name}
															sx={{
																"&:last-child td, &:last-child th": {
																	border: 0,
																},
															}}
														>
															<TableCell align="center">{poi.name}</TableCell>
															<TableCell
																sx={{
																	maxWidth: 300,
																	whiteSpace: "nowrap",
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																}}
																align="center"
															>
																{poi?.description}
															</TableCell>
															<TableCell align="center">
																{poi?.address}
															</TableCell>
															<TableCell align="center">
																{poi?.postalCode}
															</TableCell>
															<TableCell align="center">
																{poi?.city?.name}
															</TableCell>
															<TableCell align="center">
																{poi?.category.name}
															</TableCell>
															<TableCell align="center">
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
																		onClick={() =>
																			router.push(`/poi/search/${poi.name}`)
																		}
																	/>
																	<EditIcon
																		sx={{
																			color: mainTheme.palette.primary.main,
																			fontSize: "25px",
																			cursor: "pointer",
																		}}
																		onClick={() =>
																			router.push(`/poi/edit/${poi.id}`)
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
																			setPOI(poi);
																		}}
																	/>
																</Box>
															</TableCell>
														</TableRow>
													);
												} else {
													return <></>;
												}
											}
										)}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								component="div"
								count={count}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								labelRowsPerPage="Lignes par page"
								rowsPerPageOptions={[1, 2, 3, 4, 5, 6]}
							/>
							<Modal
								key={poi?.id}
								open={open}
								onClose={() => setOpen(false)}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={style}>
									<Typography
										id="modal-modal-title"
										variant="h6"
										component="h2"
									>
										{`Voulez-vous vraiment supprimer ${poi?.name} ?`}
									</Typography>
									<Button
										onClick={() => {
											deletePOI({
												variables: { deletePoiByIdId: poi?.id },
											}).then((res) => {
												refetch();
												setOpen(false);
												toast.success(
													`Le POI ${poi?.name} a bien été supprimé !`
												);
											});
										}}
									>
										Confirmer
									</Button>
									<Button
										sx={{ color: mainTheme.palette.error.main }}
										onClick={() => setOpen(false)}
									>
										Annuler
									</Button>
								</Box>
							</Modal>
						</Grid>
					</>
				) : (
					<></>
				)}
			</Grid>
		</Paper>
	);
};

export default POIList;
