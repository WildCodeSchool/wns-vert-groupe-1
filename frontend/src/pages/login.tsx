import { useAuth } from "context/UserContext";
import router from "next/router";
import React from "react";

const LoginPage = () => {
	const { onLogin, user } = useAuth();

	React.useEffect(() => {
		if (user) {
			if (user.role === "ADMIN" || user.role === "CITYADMIN") {
				router.replace("/admin");
			} else {
				router.replace("/");
			}
		}
	}, [user]);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const form = e.target;
					const formData = new FormData(form as HTMLFormElement);
					const email = formData.get("email") as string;
					const password = formData.get("password") as string;
					onLogin({
						email: email,
						password: password,
					});
				}}
				className="text-field-with-button"
			>
				<input
					name="email"
					className="text-field main-search-field"
					type="text"
					placeholder="Votre email"
				/>
				<input
					name="password"
					className="text-field main-search-field"
					type="password"
					placeholder="Votre mot de passe"
				/>
				<button className="button button-primary">Se connecter</button>
			</form>
		</div>
	);
};

export default LoginPage;
