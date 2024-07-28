import React from "react";
import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { StarHalf } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { mainTheme } from "@theme";

interface AverageRatingProps {
	averageRating: number;
}

const AverageRating: React.FC<AverageRatingProps> = ({ averageRating }) => {
	console.log("averageRating", averageRating);
	if (averageRating === null) {
		return <Typography variant="h6">No Ratings</Typography>;
	}

	const fullStars = Math.floor(averageRating);
	const hasHalfStar = averageRating - fullStars >= 0.5;

	const renderStars = () => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(
					<StarIcon key={i} sx={{ color: mainTheme.palette.primary.dark }} />
				);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(
					<StarHalf key={i} sx={{ color: mainTheme.palette.primary.dark }} />
				);
			} else {
				stars.push(
					<StarOutlineIcon
						key={i}
						sx={{ color: mainTheme.palette.primary.dark }}
					/>
				);
			}
		}
		return stars;
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				color: mainTheme.palette.primary.dark,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", marginRight: 1 }}>
				{renderStars()}
			</Box>
			<Typography variant="h6" sx={{ fontWeight: "bold" }}>
				{averageRating.toFixed(1)}
			</Typography>
		</Box>
	);
};

export default AverageRating;
