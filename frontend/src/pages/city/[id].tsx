import { useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { errors, useAuth } from "../../context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const DisplayCityByID = () => {
	const { isAuthenticated, isLoadingSession } = useAuth();
	const router = useRouter();
	const { id } = router.query;
	const { data, error, loading } = useQuery(GET_CITY_BY_ID, {
		variables: { getCityByIdId: Number(id) },
	});

	React.useEffect(() => {
		if (error) {
			toast.error("Erreur lors de la récupération des données de la ville.");
		}
	}, [error]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, isLoadingSession]);

	return isLoadingSession ? (
		<CircularProgress />
	) : isAuthenticated ? (
		<>
			{loading ? (
				<CircularProgress color="primary" />
			) : (
				<Box flex={1} paddingX={10} width={"100%"}>
					<>
						{data?.getCityById ? (
							<Grid container direction={"column"} gap={10} paddingY={10}>
								<Grid item>
									<Typography
										component="h1"
										width="auto"
										fontSize={{
											sx: mainTheme.typography.h6.fontSize,
											sm: mainTheme.typography.h5.fontSize,
											md: mainTheme.typography.h4.fontSize,
											lg: mainTheme.typography.h3.fontSize,
										}}
										color={mainTheme.palette.primary.contrastText}
										fontWeight={mainTheme.typography.fontWeightMedium}
										alignContent="center"
										padding={3}
										borderRadius={10}
										bgcolor={mainTheme.palette.primary.main}
										textAlign="left"
										paddingLeft={10}
									>
										Ville : {data?.getCityById?.name}
									</Typography>
								</Grid>
								<Grid
									item
									justifyContent="space-between"
									display={"flex"}
									direction={"column"}
									gap={10}
								>
									<Typography
										color={mainTheme.palette.secondary.dark}
										padding={4}
										border={1}
										borderColor={mainTheme.palette.secondary.light}
										borderRadius={10}
										bgcolor="white"
										textAlign="left"
										paddingLeft={10}
									>
										Description : {data?.getCityById?.description}
									</Typography>
									<Typography
										color={mainTheme.palette.secondary.dark}
										padding={3}
										border={1}
										borderColor={mainTheme.palette.secondary.light}
										borderRadius={10}
										bgcolor="white"
										textAlign="left"
										paddingLeft={10}
									>
										Latitude : {data?.getCityById?.lat}
									</Typography>
									<Typography
										color={mainTheme.palette.secondary.dark}
										padding={3}
										border={1}
										borderColor={mainTheme.palette.secondary.light}
										borderRadius={10}
										bgcolor="white"
										textAlign="left"
										paddingLeft={10}
									>
										Longitude : {data?.getCityById?.lon}
									</Typography>
								</Grid>
								<Grid item display={"flex"} direction={"column"} gap={10}>
									<Typography
										fontSize={20}
										component={"h3"}
										padding={4}
										border={1}
										borderRadius={10}
										borderColor={mainTheme.palette.primary.light}
										bgcolor={mainTheme.palette.primary.light}
										textAlign="left"
										paddingLeft={10}
										fontWeight={"bold"}
										color={mainTheme.palette.primary.dark}
									>
										Point d&apos;intérêt :{" "}
									</Typography>
									<Grid item display="flex" direction="column" gap={10}>
										{data?.getCityById?.pois.length > 0 ? (
											<>
												{data?.getCityById?.pois.map((poi: any) => {
													return (
														<Grid
															key={poi.id}
															container
															direction={"column"}
															padding={4}
															border={1}
															borderColor={mainTheme.palette.secondary.light}
															borderRadius={10}
															bgcolor="white"
															textAlign="left"
															paddingX={10}
															flexDirection={"row"}
															display={"flex"}
															justifyContent={"space-between"}
														>
															<Grid item>
																<Typography variant="h6">{poi.name}</Typography>
															</Grid>
															<Grid item>
																<Typography variant="h6">
																	{poi.category.name}
																</Typography>
															</Grid>
															<Grid item>
																<Typography variant="h6">
																	{poi.address}
																</Typography>
															</Grid>
														</Grid>
													);
												})}
											</>
										) : (
											<Typography
												padding={4}
												border={1}
												borderColor={mainTheme.palette.secondary.light}
												borderRadius={10}
												bgcolor="white"
												textAlign="left"
												paddingX={10}
												flexDirection={"row"}
												display={"flex"}
											>
												Aucun point d&apos;intrêt pour l&apos;instant
											</Typography>
										)}
									</Grid>
								</Grid>
							</Grid>
						) : (
							<></>
						)}
					</>
				</Box>
			)}
		</>
	) : (
		<Typography> {errors.connected}</Typography>
	);
};

export default DisplayCityByID;
