import { useQuery } from "@apollo/client";
import { Box, Stack, Typography } from "@mui/material";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

const DisplayCityByID = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const { id } = router.query;
	console.log(id, typeof id, Number(id));
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
	}, [isAuthenticated]);

	return (
		<Stack>
			{data?.getCityById ? (
				<Box>
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
						Ville : {data?.getCityById?.name}
					</Typography>
				</Box>
			) : (
				<></>
			)}
		</Stack>
	);
};

export default DisplayCityByID;
