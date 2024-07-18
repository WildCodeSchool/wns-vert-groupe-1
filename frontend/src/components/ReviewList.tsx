import { useQuery, gql } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import StarIcon from "@mui/icons-material/Star";
import { StarHalf } from "@mui/icons-material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { GET_REVIEWS_FOR_USER } from "@queries";

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
		return stars;
	};

	return <div>{renderStars()}</div>;
};

export const ReviewList = () => {
	const { loading, error, data } = useQuery(GET_REVIEWS_FOR_USER);

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">Error: {error.message}</Alert>;

	const userEmail = data.reviewsForUser[0]?.author?.email;
	// const displayText = userEmail ? userEmail : `User ID: ${userId}`;

	return (
		<div>
			{data.reviewsForUser.map((review: any) => (
				<div key={review.id}>
					<p>
						Rating: <RatingStars rating={review.rating} />
					</p>
					<p>Comment: {review.comment}</p>
				</div>
			))}
		</div>
	);
};
