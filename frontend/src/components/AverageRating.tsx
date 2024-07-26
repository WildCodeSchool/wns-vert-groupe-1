import React from "react";
import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { StarHalf } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

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
				stars.push(<StarIcon key={i} sx={{ color: "#FFB400" }} />);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(<StarHalf key={i} sx={{ color: "#FFB400" }} />);
			} else {
				stars.push(<StarOutlineIcon key={i} sx={{ color: "#FFB400" }} />);
			}
		}
		return stars;
	};

	return (
		<Box>
			<Typography variant="h6">{averageRating.toFixed(1)}</Typography>{" "}
			<div>{renderStars()}</div>
		</Box>
	);
};

export default AverageRating;
