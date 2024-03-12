import { useLazyQuery } from "@apollo/client";
import { UserContext } from "@components";
import { LOGIN } from "@queries";
import { useRouter } from "next/router";
import { useContext } from "react";

const LoginPage = () => {
	const router = useRouter();
	const authInfo = useContext(UserContext);

	const [handleLogin] = useLazyQuery(LOGIN, {
		async onCompleted(data) {
			localStorage.setItem("jwt", data.login);
			authInfo.refetchLogin();
			router.push("/");
		},
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const form = e.target;
					const formData = new FormData(form as HTMLFormElement);

					// Or you can work with it as a plain object:
					const formJson = Object.fromEntries(formData.entries());
					// console.log(formJson);

					handleLogin({
						variables: {
							userData: formJson,
						},
					});
					// router.back();
				}}
				className="text-field-with-button"
			>
				<input
					name="email"
					className="text-field main-search-field"
					type="text"
					defaultValue={"yuliia@gmail.com"}
				/>
				<input
					name="password"
					className="text-field main-search-field"
					type="password"
					defaultValue={"yuliia"}
				/>
				<button className="button button-primary">Login</button>
			</form>
		</div>
	);
};

export default LoginPage;
