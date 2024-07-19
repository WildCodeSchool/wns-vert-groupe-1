import { useQuery } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import StarIcon from "@mui/icons-material/Star";
import { StarHalf } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { GET_ALL_RATINGS } from "@queries";
import React from "react";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

export const RatingStars = ({ rating }: { rating: number }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;

	const renderStars = () => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(<StarIcon key={i} />);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(<StarHalf key={i} />);
			} else {
				stars.push(<StarOutlineIcon key={i} />);
			}
		}
		console.log(stars);
		return stars;
	};

	return <div>{renderStars()}</div>;
};

export const ReviewList = () => {
	const { loading, error, data } = useQuery(GET_ALL_RATINGS);
	React.useEffect(() => {
		if (data) {
			console.log("reviewData", data);
		}
		if (error) {
			// toas("error", error);
		}
	}, [data]);
	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">Error: {error.message}</Alert>;

	// const userEmail = data.reviewsForUser[0]?.author?.email;
	// const displayText = userEmail ? userEmail : `User ID: ${userId}`;

	return (
		<Box>
			{data?.getAllRatings.map((review: any) => (
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
