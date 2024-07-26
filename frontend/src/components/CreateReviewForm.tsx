import { useState } from "react";
import { useMutation } from "@apollo/client";
import { mainTheme } from "@theme";
import {
	TextField,
	Button,
	CircularProgress,
	Alert,
	Paper,
	Rating,
} from "@mui/material";
import { CREATE_REVIEW_MUTATION } from "../graphql/mutations/mutations";
import { useRouter } from "next/router";

import { useAuth } from "context";

export const CreateReviewForm = () => {
	const [rating, setRating] = useState<number | null>(null);
	const [comment, setComment] = useState("");
	const [errorText, setErrorText] = useState("");
	const { user } = useAuth();
	const [createReview, { loading, error, data }] = useMutation(
		CREATE_REVIEW_MUTATION
	);

	// id de lieu
	const router = useRouter();
	const { id, rating: urlRating } = router.query;

	const handleSubmit = async (e: React.FormEvent) => {
		console.log(rating, comment);
		e.preventDefault();
		if (!rating || rating < 1 || rating > 5) {
			setErrorText("Votre note doit être comprise entre 1 et 5");
			return;
		}
		try {
			await createReview({
				variables: {
					ratingData: {
						rating,
						text: comment,
						// user: user!.id,
						user: 7,
						poi: parseFloat(id as string),
					},
				},
			});

			setRating(null);
			setComment("");
			setErrorText("");
		} catch (error) {
			console.error("Error creating review:", error);
		}
	};

	return (
		<>
			<div style={{ marginTop: "1rem" }}></div>
			<form onSubmit={handleSubmit}>
				<div>
					<Rating
						name="rating"
						value={rating}
						onChange={(event, newValue) => {
							setRating(newValue);
						}}
					/>
					{errorText && <p style={{ color: "red" }}>{errorText}</p>}
				</div>
				<div>
					<TextField
						required
						label="Commentaire"
						placeholder="Écrivez votre commentaire ici"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						multiline
						rows={4}
						sx={{
							backgroundColor: "white",
							width: "100%",
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: mainTheme.palette.primary.main,
								},
							},
						}}
					/>
				</div>
				<div
					style={{
						marginTop: "0.50rem",
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<Button
						type="submit"
						disabled={loading}
						sx={{
							textTransform: "none",
							backgroundColor: mainTheme.palette.primary.dark,
							color: "white",
							"&:hover": {
								backgroundColor: mainTheme.palette.primary.light,
								color: mainTheme.palette.primary.dark,
							},
						}}
					>
						{loading ? <CircularProgress size={24} /> : "Ajouter"}
					</Button>
				</div>
				{error && <Alert severity="error">Error: {error.message}</Alert>}
				{data && (
					<Alert severity="success">Commentaire créé avec succès !</Alert>
				)}
			</form>
		</>
	);
};
