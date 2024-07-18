import { useQuery, useMutation } from "@apollo/client";
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
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

	const { data: poisData, loading, error } = useQuery(GET_ALL_POIS);

	console.log(poisData);

	const [
		deletePOI,
		{ data: deletePOIData, loading: deletePOILoading, error: deletePOIError },
	] = useMutation(DELETE_POI_BY_ID);

	React.useEffect(() => {
		if (poisData?.getAllPois) {
			setCount(poisData?.getAllPois.length + 1);
		}
	}, [poisData]);

	if (error) return <p>Error :</p>;

return loading ? (
	<CircularProgress />
) : (
	<Paper
		component={Box}
		elevation={5}
		square={false}
		width="90%"
		height="auto"
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
			{!loading && poisData?.getAllPois && poisData?.getAllPois?.length > 0 ? (
				<>
					<Grid item width="95%" mx="auto">
						<TableContainer component={Paper}>
							<Table
								sx={{
									minWidth: 650,
									marginY: "2rem",
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
										<TableCell align="center">Latitude</TableCell>
										<TableCell align="center">Longitude</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{poisData?.getAllPois?.map((poi: PoiType, index: number) => {
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
												<TableCell align="center">{poi?.address}</TableCell>
												<TableCell align="center">{poi?.postalCode}</TableCell>
												<TableCell align="center">{poi?.city?.name}</TableCell>
												<TableCell align="center">
													{poi?.category.name}
												</TableCell>
												<TableCell align="center">{poi?.latitude}</TableCell>
												<TableCell align="center">{poi?.longitude}</TableCell>
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
															onClick={() => router.push(`/poi/${poi.id}`)}
														/>
														<EditIcon
															sx={{
																color: mainTheme.palette.primary.main,
																fontSize: "25px",
																cursor: "pointer",
															}}
															onClick={() => router.push(`/poi/edit/${poi.id}`)}
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
									})}
								</TableBody>
							</Table>
						</TableContainer>

						<Modal
							key={poi?.id}
							open={open}
							onClose={() => setOpen(false)}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={style}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									{`Voulez-vous vraiment supprimer ${poi?.name} ?`}
								</Typography>
								<Button
									onClick={() => {
										deletePOI({
											variables: { id: poi?.id },
										}).then((res) => {
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
					sx={{ mt: 4 }}
				>
					Aucun POI trouvé.
				</Typography>
			)}
		</Grid>
	</Paper>
);
};

export default POIList;
