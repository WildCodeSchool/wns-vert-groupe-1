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
console.log(data)
  const [
    createNewPoi,
    { data: createdPoiData, loading: createPoiLoading, error: createPoiError },
  ] = useMutation(CREATE_NEW_POI);

  const onSubmit: SubmitHandler<Inputs> = async ( data: any) => {
      try {
        const result = await createNewPoi({
          variables: {
            poiData: {
              name: data.name,
              address: data.address,
              description: data.description,
              city: Number.parseInt(data.city),
            },
          },
        });
        console.log("result", result);
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
          <select {...register("city")}>
            {data?.getAllCities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <input className="button" type="submit" />
        </form>
      </div>
    );
  };
};

export default NewPoi;