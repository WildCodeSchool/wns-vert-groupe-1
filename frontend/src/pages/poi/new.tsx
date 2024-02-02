'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_POI } from "../../graphql/mutations/mutations";

type Inputs = {
    name: string;
    address: string;
    description: string;
};

const NewPoi = () => {
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

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
            },
          },
        });
        console.log("result", result);
        reset();

      } catch (err: any) {
        console.error(err);
      }
    }

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
          <br />
          <br />
          <input className="button" type="submit" />
        </form>
      </div>
    );
  };

export default NewPoi;