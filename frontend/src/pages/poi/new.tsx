'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { GeoCodingService } from '../../service/GeoCodingService';

import { CREATE_NEW_POI } from "../../graphql/mutations/mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "../../graphql/queries/queries";

type Inputs = {
    name: string;
    address: string;
    description: string;
    city:string;
    category:string;
    postalCode:string;
    latitude: number;
    longitude: number;
};

const NewPoi = () => {
 
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
    try {
      const coordinates = await GeoCodingService.getCoordinates(formData.address);
  
      if (coordinates) {
        formData.latitude = coordinates.latitude;
        formData.longitude = coordinates.longitude;
      }
  
      const result = await createNewPoi({
        variables: {
          poiData: {
            name: formData.name,
            address: formData.address,
            postalCode: formData.postalCode,
            description: formData.description,
            city: Number.parseInt(formData.city),
            category: Number.parseInt(formData.category),
            latitude: formData.latitude, 
            longitude: formData.longitude, 
          },
        },
      });

      reset();
    } catch (err: any) {
      console.error(err);
    }
  }

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
          Code Postal: <br />
            <input className="text-field" {...register("postalCode")} />
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
  };
};

export default NewPoi;