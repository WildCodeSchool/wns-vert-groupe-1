import { Box, Typography } from "@mui/material";
import { mainTheme } from "@theme";
import { PoiType } from "@types";

export const PoiCard = ({ name, images, category, description }: PoiType) => {
	return (
		<Box
			marginTop={3}
			marginBottom={3}
			bgcolor={mainTheme.palette.primary.contrastText}
		>
			<Typography
				component="strong"
				color={mainTheme.palette.primary.dark}
				sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold" }}
			>
				{name}
			</Typography>
			{images && (
				<Box display="flex" justifyContent="center" alignItems="center">
					{images.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Image ${index + 1}`}
							style={{ width: "100%", maxWidth: "200px", margin: "5px" }}
						/>
					))}
				</Box>
			)}
			<Typography
				component="strong"
				color={mainTheme.palette.primary.dark}
				sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold" }}
			>
				{category.name}
			</Typography>
			<Typography
				color={mainTheme.palette.primary.dark}
				sx={{ fontSize: mainTheme.typography.h5 }}
			>
				{description}
			</Typography>
		</Box>
	);
};
