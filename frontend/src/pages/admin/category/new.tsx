import {
	Typography,
	TextField,
	Box,
	Grid,
	CircularProgress,
} from "@mui/material";
import { mainTheme } from "@theme";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useLayoutEffect, useState } from "react";
import { CREATE_NEW_CATEGORY } from "@mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CategoryInput } from "@types";
import { toast } from "react-toastify";
import { errors as ErrorContext, useAuth } from "context";
import { useRouter } from "next/navigation";
import { CHECK_CATEGORY_UNIQUE } from "@queries";
import { BackButton, RoundedButton } from "@components";

const commonTextFieldStyles = {
	"& .MuiOutlinedInput-root": {
		backgroundColor: "white",
		borderRadius: "2rem",
		"& fieldset": {
			borderColor: "transparent",
		},
		"&:hover fieldset": {
			borderColor: "transparent",
		},
		"&.Mui-focused fieldset": {
			borderColor: "transparent",
		},
		"& .MuiOutlinedInput-input": {
			paddingLeft: "2rem",
		},
	},
};

const NewCategory = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [createNewCategory] = useMutation(CREATE_NEW_CATEGORY, {
		onCompleted: () => {
			toast.success("La catégorie a été créée avec succès!");
			reset();
			router.push("/admin/category/list");
		},
		onError: (error) => {
			console.error("Error creating city:", error, error.message);
			toast.error(
				"Une erreur est survenue lors de la création de la catégorie"
			);
		},
	});

	const [checkCategoryUnique] = useLazyQuery(CHECK_CATEGORY_UNIQUE);

	const [isNameUnique, setIsNameUnique] = useState<boolean>(true);

	const {
		register: CategoryForm,
		handleSubmit,
		reset,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<CategoryInput>({
		defaultValues: {
			name: "",
		},
		mode: "onBlur",
	});

	const watchedName = watch("name");

	const isDisabled =
		Object.keys(errors).length > 0 || !watchedName || !isNameUnique;

	const onSubmit: SubmitHandler<CategoryInput> = async (formData) => {
		const formattedName = formData.name.trim().toLocaleLowerCase();

		try {
			onBlur(formattedName);
			await createNewCategory({
				variables: { categoryData: { ...formData, name: formattedName } },
			});
		} catch (error) {
			toast.error(
				"Une erreur est survenue lors de la création de la catégorie"
			);
		}
	};

	const onBlur = async (categoryName: string) => {
		if (categoryName) {
			try {
				const { data } = await checkCategoryUnique({
					variables: { name: categoryName },
				});
				setIsNameUnique(data.isCategoryNameUnique);
				if (data && data.isCategoryNameUnique === false) {
					setError("name", {
						type: "manual",
						message:
							"Ce nom de catégorie existe déjà. Veuillez en choisir un autre.",
					});
				} else {
					clearErrors("name");
				}
			} catch (error) {
				console.error(
					"Erreur lors de la vérification d'unicité du nom de catégorie",
					error
				);
			}
		} else {
			setError("name", {
				type: "manual",
				message: "Le nom de la catégorie est requis",
			});
		}
	};

	useLayoutEffect(() => {
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
	) : !isAuthenticated ? (
		<Typography>{ErrorContext.connected}</Typography>
	) : (
		<>
			{user?.role !== "ADMIN" ? (
				<Typography>{ErrorContext.role}</Typography>
			) : (
				<Grid
					container
					padding={8}
					flex={1}
					flexDirection="column"
					alignItems="center"
					gap={mainTheme.spacing(8)}
				>
					<BackButton />
					<Grid
						item
						width="100%"
						direction="row"
						flexDirection="row"
						display="flex"
						paddingX={8}
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="h1"
							color={mainTheme.palette.primary.main}
							fontSize={mainTheme.typography.h3.fontSize}
							textTransform="uppercase"
						>
							Création d&apos;une nouvelle catégorie
						</Typography>
					</Grid>
					<Grid item width="100%" paddingX={4}>
						<Box
							component="form"
							onSubmit={handleSubmit(onSubmit)}
							flex={1}
							display="flex"
							flexDirection="column"
							justifyContent="space-evenly"
							alignItems="center"
							height="100%"
							padding={5}
							gap={6}
						>
							<TextField
								autoCapitalize="on"
								data-testid="input_name"
								id="name"
								variant="outlined"
								placeholder="Nom de la catégorie *"
								required
								size="medium"
								fullWidth
								margin="normal"
								{...CategoryForm("name", {
									required: "Le nom de la catégorie est requis",
									pattern: {
										value: /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-\s]+$/,
										message:
											"Le nom de la catégorie ne peut contenir que des lettres, des espaces, des traits d'union, des apostrophes ou des caractères accentués.",
									},
									minLength: {
										value: 1,
										message: "Le nom doit comporter au moins 1 caractère",
									},
									maxLength: {
										value: 50,
										message: "Le nom ne doit pas dépasser 50 caractères",
									},
								})}
								onBlur={(e) => {
									onBlur(e.target.value.trim().toLocaleLowerCase());
								}}
								error={!!errors.name}
								helperText={errors.name?.message}
								sx={commonTextFieldStyles}
							/>
							<RoundedButton
								data-testid="send_form"
								type="submit"
								label="Soumettre le formulaire de création de catégorie"
								disabled={isDisabled}
							>
								Créer
							</RoundedButton>
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default NewCategory;
