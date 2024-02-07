"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { CREATE_NEW_POI } from "@mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { POIInput } from "@types";

const NewPOI = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm<POIInput>();

	const {
		loading: cityLoading,
		error: cityError,
		data: cityData,
	} = useQuery<{
		getAllCities: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CITIES);

	const {
		loading: categoryLoading,
		error: categoryError,
		data: categoryData,
	} = useQuery<{
		getAllCategories: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CATEGORIES);

	const [
		createNewPoi,
		{ data: createdPoiData, loading: createPoiLoading, error: createPoiError },
	] = useMutation(CREATE_NEW_POI);

	const onSubmit: SubmitHandler<POIInput> = async (formData: any) => {
		console.log("données du form", formData);

		try {
			const result = await createNewPoi({
				variables: {
					poiData: {
						name: formData.name,
						address: formData.address,
						description: formData.description,
						city: Number.parseInt(formData.city),
						category: Number.parseInt(formData.category),
					},
				},
			});
			reset();
		} catch (err: any) {
			console.error(err);
		}
	};

	if (cityData && categoryData) {
		return (
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<label>
						Nom: <br />
						<input className="text-field" {...register("name")} />
					</label>
					<br />
					<label>
						Adresse: <br />
						<input className="text-field" {...register("address")} />
					</label>
					<br />
					<label>
						Description: <br />
						<input className="text-field" {...register("description")} />
					</label>
					<br />
					<label>
						Ville: <br />
						<select {...register("city")}>
							{cityData?.getAllCities?.map((city) => (
								<option key={city.id} value={city.id}>
									{city.name}
								</option>
							))}
						</select>
					</label>
					<br />
					<label>
						Catégorie: <br />
						<select {...register("category")}>
							{categoryData?.getAllCategories?.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</label>
					<br />
					<br />
					<input className="button" type="submit" />
				</form>
			</div>
		);
	}
};

export default NewPOI;
