import { useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import StarIcon from "@mui/icons-material/Star";
import { StarHalf } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { GET_RATINGS_BY_POI } from "@queries";
import React from "react";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { mainTheme } from "@theme";

export const RatingStars = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;

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
		console.log(stars);
		return stars;
	};

	return <div>{renderStars()}</div>;
};

export const ReviewList = ({
	poiId,
	refetch,
}: {
	poiId: number;
	refetch: () => void;
}) => {
	const { loading, error, data } = useQuery(GET_RATINGS_BY_POI, {
		variables: { poiId },
	});

	React.useEffect(() => {
		if (data) {
			console.log("reviewData", data);
		}
		if (error) {
			console.log("error", error);
		}
	}, [data]);

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">Error: {error.message}</Alert>;

	return (
		<Box
			sx={{
				marginTop: "0.50rem",
				maxHeight: "200px",
				overflowY: "auto",
				padding: "1rem",
			}}
		>
			{data?.getRatingsByPoi.map((review: any) => (
				<Box key={review.id}>
					<Typography>
						<RatingStars rating={review.rating} />
					</Typography>
					<Typography>
						{review.user.firstName} {review.user.lastName}
					</Typography>
					<Typography>{review.text}</Typography>
				</Box>
			))}
		</Box>
	);
};
