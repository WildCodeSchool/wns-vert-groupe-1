import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import axios from "axios";

import { CREATE_NEW_POI } from "../../graphql/mutations/mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "../../graphql/queries/queries";

type Inputs = {
  name: string;
  address: string;
  description: string;
  city: string;
  category: string;
  images: string[];
};

const NewPoi = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const { loading: cityLoading, error: cityError, data: cityData } = useQuery<{
    getAllCities: {
      id: number;
      name: string;
    }[];
  }>(GET_ALL_CITIES);

  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery<{
    getAllCategories: {
      id: number;
      name: string;
    }[];
  }>(GET_ALL_CATEGORIES);

  const [
    createNewPoi,
    { data: createdPoiData, loading: createPoiLoading, error: createPoiError },
  ] = useMutation(CREATE_NEW_POI);

  const onSubmit: SubmitHandler<Inputs> = async (formData: Inputs) => {
    console.log("données du form", formData);

    try {
      const result = await createNewPoi({
        variables: {
          poiData: {
            name: formData.name,
            address: formData.address,
            description: formData.description,
            images: imageURLs.map(image => "http://localhost:8000" + image),
            city: Number.parseInt(formData.city),
            category: Number.parseInt(formData.category),
          },
        },
      });
      setImageURLs([]);
      setFiles([]);
      reset();

    } catch (err: any) {
      console.error(err);
    }
  };


  if (cityData && categoryData) {
    return (
      <div>
        <input
          type="file"
          onChange={async (e) => {
            if (e.target.files) {
              const selectedFiles = Array.from(e.target.files);
              setFiles(selectedFiles);
              const url = "http://localhost:8000/upload";
              selectedFiles.forEach(async (file, index) => {
                const formData = new FormData();
                formData.append("file", file, file.name);
                try {
                  const response = await axios.post(url, formData);
                  console.log(response)
                  setImageURLs(prevImageURLs => [...prevImageURLs, response.data.filename]);
                } catch (err) {
                  console.log("error", err);
                }
              });
            }
          }}
          multiple
        />

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

export default NewPoi;
