'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { CREATE_NEW_POI } from "../../graphql/mutations/mutations";
import { GET_ALL_CITIES } from "../../graphql/queries/queries";


type Inputs = {
    name: string;
    address: string;
    description: string;
    city:string
};

const NewPoi = () => {
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const { loading, error, data } = useQuery<{
    getAllCities: {
      id: number;
      name: string;
    }[];
  }>(GET_ALL_CITIES);
  const [
    createNewPoi,
    { data: createdPoiData, loading: createPoiLoading, error: createPoiError },
  ] = useMutation(CREATE_NEW_POI);

  const onSubmit: SubmitHandler<Inputs> = async ( formData: any) => {
    console.log("données du form", formData);

      try {
        const result = await createNewPoi({
          variables: {
            poiData: {
              name: formData.name,
              address: formData.address,
              description: formData.description,
              city: Number.parseInt(formData.city),
            },
          },
        });
        reset();

      } catch (err: any) {
        console.error(err);
      }
    }
    if (data) {

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
            {data?.getAllCities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
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