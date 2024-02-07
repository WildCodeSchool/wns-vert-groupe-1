"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { CREATE_NEW_POI } from "@mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { POIInput } from "@types";
import axios from "axios";

const NewPoi = () => {
	const [imageURLs, setImageURLs] = useState<string[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<POIInput>();

	const { data: cityData } = useQuery<{
		getAllCities: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CITIES);

	const { data: categoryData } = useQuery<{
		getAllCategories: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CATEGORIES);

	const [createNewPoi] = useMutation(CREATE_NEW_POI);

	const onSubmit: SubmitHandler<POIInput> = async (formData: POIInput) => {
		try {
			const result = await createNewPoi({
				variables: {
					poiData: {
						name: formData.name,
						address: formData.address,
						description: formData.description,
						images: imageURLs.map((image) => "http://localhost:8000" + image),
						city: Number.parseInt(formData.city),
						category: Number.parseInt(formData.category),
					},
				},
			});
			setImageURLs([]);
			reset();
		} catch (err: any) {
			console.error(err);
		}
	};

	if (cityData && categoryData) {
		return (
			<div>
				<h2>Ajouter un POI</h2>

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
					<input
						type="file"
						onChange={async (e) => {
							if (e.target.files) {
								const selectedFiles = Array.from(e.target.files);
								const url = "http://localhost:8000/upload";
								selectedFiles.forEach(async (file) => {
									const formData = new FormData();
									formData.append("file", file, file.name);
									try {
										const response = await axios.post(url, formData);
										console.log(response);
										setImageURLs((prevImageURLs) => [
											...prevImageURLs,
											response.data.filename,
										]);
									} catch (err) {
										console.log("error", err);
									}
								});
							}
						}}
						multiple
					/>
					<br />
					<br />
					<input className="button" type="submit" />
				</form>

				{imageURLs.map((url, index) => (
					<div key={index}>
						<br />
						<img
							width={"500"}
							alt={`uploadedImg${index}`}
							src={"http://localhost:8000" + url}
						/>
						<br />
					</div>
				))}
			</div>
		);
	}
};

export default NewPoi;
