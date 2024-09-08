import { useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { errors, useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { BackButton, RoundedBox } from "@components";
import { capitalizeFrenchName } from "utils";

const DisplayCityByID = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
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

	return isLoadingSession ? (
		<CircularProgress />
	) : isAuthenticated && user?.role === "ADMIN" ? (
		<>
			{loading ? (
				<CircularProgress color="primary" />
			) : (
				<Box flex={1} paddingX={10} width="100%">
					<>
						{data?.getCityById ? (
							<Grid container direction="column" gap={5}>
								<BackButton />
								<Grid item>
									<RoundedBox color={mainTheme.palette.primary.main}>
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
										>
											Ville : {data?.getCityById?.name}
										</Typography>
									</RoundedBox>
								</Grid>
								<Grid
									item
									justifyContent="space-between"
									display="flex"
									direction="column"
									gap={5}
								>
									<RoundedBox>
										<Typography color={mainTheme.palette.secondary.dark}>
											Description : {data?.getCityById?.description}
										</Typography>
									</RoundedBox>
									<RoundedBox>
										<Typography color={mainTheme.palette.secondary.dark}>
											Latitude : {data?.getCityById?.lat}
										</Typography>
									</RoundedBox>
									<RoundedBox>
										<Typography color={mainTheme.palette.secondary.dark}>
											Longitude : {data?.getCityById?.lon}
										</Typography>
									</RoundedBox>
								</Grid>
								<Grid
									item
									display="flex"
									direction="column"
									gap={5}
									paddingTop={10}
								>
									<RoundedBox color={mainTheme.palette.primary.light}>
										<Typography
											fontSize={20}
											component="h3"
											fontWeight="bold"
											color={mainTheme.palette.primary.dark}
										>
											Point d&apos;intérêt :{" "}
										</Typography>
									</RoundedBox>
									<Grid item display="flex" direction="column" gap={10}>
										{data?.getCityById?.pois.length > 0 ? (
											<>
												{data?.getCityById?.pois.map((poi: any) => {
													return (
														<Grid
															key={poi.id}
															container
															direction="column"
															padding={4}
															border={1}
															borderColor={mainTheme.palette.secondary.light}
															borderRadius={10}
															bgcolor="white"
															textAlign="left"
															paddingX={10}
															flexDirection="row"
															display="flex"
															justifyContent="space-between"
														>
															<Grid item>
																<Typography variant="h6">
																	{poi?.name
																		? capitalizeFrenchName(poi.name)
																		: ""}
																</Typography>
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
											<RoundedBox>
												<Typography flexDirection="row" display="flex">
													Aucun point d&apos;intrêt pour l&apos;instant
												</Typography>
											</RoundedBox>
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
