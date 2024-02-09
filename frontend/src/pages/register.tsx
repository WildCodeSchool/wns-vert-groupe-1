import { useMutation, useQuery } from "@apollo/client";
import { REGISTER } from "@mutations";
import { GET_ALL_CITIES } from "@queries";
import { CityType } from "@types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
	firstName: string;
	lastName: number;
	email: string;
	password: string;
	city?: number;
};

const Register = () => {
	const router = useRouter();

	const { data } = useQuery(GET_ALL_CITIES);
	const {
		register: registerForm,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();

	const [cities, setCities] = useState<CityType[]>([]);

	const [register] = useMutation(REGISTER);

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		console.log("form data", data);
		try {
			data.city = Number(data.city);
			console.log("data form", data);

			const result = await register({
				variables: {
					newUserData: {
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						password: data.password,
						city: data.city,
					},
				},
			});
			console.log("result", result);
			reset();
			router.push("/login");
		} catch (err: any) {
			console.error("Error submitting form:", err);
		}
	};

	useEffect(() => {
		if (data) {
			setCities(data.getAllCities);
		}
	}, [data]);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-10">
					<input
						className="text-field"
						placeholder="Prénom :"
						{...registerForm("firstName", { required: true })}
					/>
					{errors.firstName && <span>This field is required</span>}
				</div>
				<div className="mb-10">
					<input
						placeholder="Nom :"
						className="text-field"
						{...registerForm("lastName", { required: true })}
					/>
					{errors.lastName && <span>This field is required</span>}
				</div>
				<div className="mb-10">
					<input
						placeholder="e-mail :"
						className="text-field"
						{...registerForm("email", {
							required: true,
							maxLength: 200,
						})}
					/>
					{errors.email && <span>This field is required</span>}
				</div>
				<div className="mb-10">
					<input
						className="text-field"
						placeholder="Mot de passe :"
						{...registerForm("password", { required: true })}
						type="password"
					/>
					{errors.password && <span>This field is required</span>}
				</div>
				<select {...registerForm("city")} className="mb-10">
					{cities.map((el) => (
						<option value={el.id} key={el.id}>
							{el.name}
						</option>
					))}
				</select>
				<button className="button">Submit</button>
			</form>
		</>
	);
};

export default Register;
