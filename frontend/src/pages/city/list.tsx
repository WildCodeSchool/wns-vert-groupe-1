import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Grid,
	Paper,
	Stack,
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
import { useAuth } from "context";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import useWindowDimensions from "utils/windowDimensions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_CITY_BY_ID } from "@mutations";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const CityList = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const { height, width } = useWindowDimensions();

	const {
		data: citiesData,
		loading: citiesLoading,
		error: citiesError,
	} = useQuery(GET_ALL_CITIES);
	const [
		deleteCity,
		{
			data: deleteCityData,
			loading: deleteCityLoading,
			error: deleteCityError,
		},
	] = useMutation(DELETE_CITY_BY_ID);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	React.useEffect(() => {
		if (citiesError) {
			toast.error(
				"Une erreur est surveune lors de la récupération des données."
			);
		}

		if (deleteCityError) {
			toast.error(
				"Une erreur est surveune lors de la suppression de la ville."
			);
		}
	}, [citiesError, deleteCityError]);

	return (
		<Stack
			display="flex"
			justifyContent="center"
			alignContent="center"
			flex={1}
			width={width}
			height={height - 120}
		>
			<Paper
				component={Box}
				elevation={5}
				square={false}
				mx="auto"
				sx={{
					display: "flex",
					flexDirection: "column",
					height: (height - 120) * 0.8,
					width: width * 0.8,
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
							// sx={{ backgroundColor: "black" }}
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
								Listes des villes :
							</Typography>
							<AddCircleIcon
								onClick={() => router.push("/city/new")}
								sx={{
									color: mainTheme.palette.primary.main,
									fontSize: "50px",
									cursor: "pointer",
								}}
							/>
						</Box>
					</Grid>
					<Grid item width="95%" mx="auto">
						<TableContainer component={Table}>
							<Table
								sx={{
									minWidth: 650,
									border: `2px solid ${mainTheme.palette.primary.main}`,
									borderRadius: "3px",
									"& .MuiTableCell-root": {
										// Borders for each cell
										border: `2px solid ${mainTheme.palette.primary.main}`,
									},
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
										<TableCell align="center">POI</TableCell>
										<TableCell align="center">Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{citiesData?.getAllCities?.map((city: any) => (
										<TableRow
											key={city.name}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell align="center">{city.name}</TableCell>
											{/*  component="th" scope="row" */}
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
											<TableCell align="center">{city?.users?.pois}</TableCell>
											<TableCell align="center">
												<Box
													display="flex"
													flexDirection="row"
													justifyContent="center"
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
															router.push(`/city/${city.id}`);
														}}
													/>
													<EditIcon
														sx={{
															color: mainTheme.palette.primary.main,
															fontSize: "25px",
															cursor: "pointer",
														}}
														onClick={() => {
															console.log("go to edit city page");
														}}
													/>
													<DeleteIcon
														sx={{
															color: mainTheme.palette.primary.main,
															fontSize: "25px",
															cursor: "pointer",
														}}
														onClick={() => {
															deleteCity({
																variables: { deleteCityByIdId: city?.id },
															}).then((res) => {
																toast.success(
																	`La ville ${city.name} a bien été supprimé !`
																);
															});
														}}
													/>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</Paper>
		</Stack>
	);
};

export default CityList;
