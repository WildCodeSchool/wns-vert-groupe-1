import { useState, useEffect, Component } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import {
	Breadcrumbs,
	Typography,
	Grid,
	Link,
	CircularProgress,
	Button,
	TextField,
	Alert,
	Rating,
	Box,
} from "@mui/material";
import { GET_ALL_RATINGS, GET_POI_BY_ID, GET_RATINGS_BY_POI } from "@queries";
import { PoiType } from "@types";
import { mainTheme } from "@theme";
import PlaceIcon from "@mui/icons-material/Place";
import { ImagesCarousel, RatingStars } from "@components";
import AverageRating from "components/AverageRating";
import { CREATE_REVIEW_MUTATION } from "@mutations";
import { useAuth } from "context";
import { toast } from "react-toastify";
import { ReviewList } from "@components";

const POIDetails = () => {
	const router = useRouter();
	const [rating, setRating] = useState<number | null>(null);
	const [comment, setComment] = useState("");
	const [errorText, setErrorText] = useState("");
	const { user } = useAuth();
	const [
		createReview,
		{ loading: reviewLoading, error: reviewError, data: reviewData },
	] = useMutation(CREATE_REVIEW_MUTATION);

	const { id, rating: urlRating } = router.query;

	const {
		loading: poiLoading,
		error: poiError,
		data: poiData,
		refetch: poiRefetch,
	} = useQuery(GET_POI_BY_ID, {
		variables: { id: parseInt(router.query.id as string) },
	});

	const {
		loading: reviewListLoading,
		error: reviewListError,
		data: reviewListData,
		refetch: reviewListRefetch,
	} = useQuery(GET_RATINGS_BY_POI, {
		variables: { poiId: parseInt(router.query.id as string) },
	});

	const handleSubmit = async (e: React.FormEvent) => {
		console.log(rating, comment);
		if (!user) {
			setErrorText("Pour laisser un commentaire, veuillez vous connecter.");
			return;
		}
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
						user: user?.id,
						poi: parseFloat(id as string),
					},
				},
			});

			setRating(null);
			setComment("");
			setErrorText("");

			reviewListRefetch();
			poiRefetch();
		} catch (error) {
			console.error("Error creating review:", error);
		}
	};

	const [POI, setPOI] = useState<PoiType>({
		name: "",
		address: "",
		description: "",
		images: [],
		city: undefined,
		category: undefined,
		ratings: [],
		averageNote: 0,
	});

	useEffect(() => {
		if (!poiLoading && poiData && poiData.getPoiById) {
			setPOI({
				name: poiData.getPoiById.name,
				address: poiData.getPoiById.address,
				description: poiData.getPoiById.description,
				images: poiData.getPoiById.images,
				city: poiData.getPoiById.city,
				category: poiData.getPoiById.category,
				ratings: poiData.getPoiById.ratings,
				averageNote: poiData.getPoiById.averageNote,
			});
		}
	}, [poiData, poiError, router.query.id, poiLoading]);

	const handleCityClick = () => {
		router.push(`/city/search/${POI.city}`);
	};

	const handleCategoryClick = () => {
		router.push(`/city/search/${POI.city}/category/${POI.category}`);
	};

	if (poiError || reviewListError) toast.error("Une erreur est survenue.");

	return poiLoading || reviewListLoading ? (
		<CircularProgress />
	) : (
		<div>
			<Breadcrumbs
				aria-label="breadcrumb"
				separator="›"
				sx={{ marginTop: "1rem", marginLeft: "1rem" }}
			>
				<Link
					underline="hover"
					onClick={handleCityClick}
					sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
					color={mainTheme.palette.primary.dark}
				>
					{POI.city?.name}
				</Link>
				<Link
					underline="hover"
					onClick={handleCategoryClick}
					sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
					color={mainTheme.palette.primary.dark}
				>
					{POI.category?.name}
				</Link>
				<Link
					underline="hover"
					sx={{ fontSize: mainTheme.typography.h6, fontWeight: "light" }}
					color={mainTheme.palette.primary.dark}
				>
					{POI.name}
				</Link>
			</Breadcrumbs>
			<Grid container spacing={6} sx={{ padding: "1rem" }}>
				<Grid item xs={6}>
					<ImagesCarousel images={POI.images} />
				</Grid>
				<Grid item xs sx={{ padding: "1rem" }}>
					<Typography
						color={mainTheme.palette.primary.main}
						align="center"
						sx={{ fontSize: mainTheme.typography.h3, fontWeight: "bold" }}
					>
						{POI.name}
					</Typography>
					<Typography
						align="justify"
						sx={{ fontSize: mainTheme.typography.h6, marginTop: "3rem" }}
					>
						{POI.description}
					</Typography>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginTop: "3rem",
						}}
					>
						<PlaceIcon color="primary" />
						<Typography sx={{ fontSize: mainTheme.typography.h6 }}>
							{POI.address}
						</Typography>
					</div>
					<Typography
						color={mainTheme.palette.primary.main}
						align="left"
						sx={{
							fontSize: mainTheme.typography.h4,
							fontWeight: "bold",
							marginTop: "3rem",
						}}
					>
						NOTE MOYENNE
					</Typography>
					<AverageRating averageRating={POI.averageNote ?? 0} />
					<Typography
						color={mainTheme.palette.primary.main}
						align="left"
						sx={{
							fontSize: mainTheme.typography.h4,
							fontWeight: "bold",
							marginTop: "3rem",
						}}
					>
						COMMENTAIRES
					</Typography>
					{user && (
						<>
							<form>
								<div>
									<Rating
										name="rating"
										value={rating}
										precision={0.5}
										onChange={(event: any, newValue) => {
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

								{reviewError && (
									<Alert severity="error">
										Une erreur est survenue lors de l'ajout du commentaire.
									</Alert>
								)}
								{reviewData && (
									<Alert severity="success">
										Commentaire créé avec succès !
									</Alert>
								)}
							</form>
							<div
								style={{
									marginTop: "0.50rem",
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								<Button
									type="submit"
									disabled={reviewLoading}
									onClick={handleSubmit}
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
									{reviewLoading ? <CircularProgress size={24} /> : "Ajouter"}
								</Button>
							</div>
						</>
					)}
					{!user && <h5>Merci de vous connecter pour laisser un message</h5>}
					<ReviewList
						poiId={parseInt(router.query.id as string)}
						refetch={reviewListRefetch}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default POIDetails;
