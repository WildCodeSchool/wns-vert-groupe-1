import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECK_INFO, GET_USER, LOGIN } from "../graphql/queries/queries";
import { LoginT, UserType, UserInput } from "@types";
import { useRouter } from "next/router";
import React from "react";
import { PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { REGISTER } from "../graphql/mutations/mutations";

interface Store {
	user: UserType | undefined;
	error?: string;
	isAuthenticated: boolean;
	jwt: string | undefined;
	loading?: boolean;
	isLoading: boolean;
	onLogout: () => void;
	onLogin: (payload: LoginT) => void;
	onRegister: (payload: UserInput) => void;
	setUser: (user: UserType) => void;
	setError: (error?: string) => void;
}

const defaultStore: Store = {
	user: undefined,
	error: undefined,
	isAuthenticated: false,
	jwt: undefined,
	loading: false,
	isLoading: false,
	setUser: () => {},
	onLogin: () => {},
	onRegister: () => {},
	setError: () => {},
	onLogout: () => {},
};

export const errors = {
	getUser: "Une erreur est survenue lors de la récupération de votre compte",
	login: "Email ou mot de passe incorrect, réessayez à nouveau.",
	register: "Une erreur est survenue lors de votre inscription.",
	connected: "Vous devez être connecté pour accéder à cette page.",
	role: "Vous n'avez pas les droits pour accéder à cette page.",
};

const UserContext = React.createContext(defaultStore);

const useAuth = () => React.useContext(UserContext);

function UserProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const [user, setUser] = React.useState(defaultStore["user"]);
	const [error, setError] = React.useState(defaultStore["error"]);
	const [checkSession, { loading: loadingCheckSession, refetch }] =
		useLazyQuery(CHECK_INFO);
	const [jwt, setJwt] = React.useState(defaultStore["jwt"]);
	const [login, { loading: loadingLogin }] = useLazyQuery(LOGIN);
	const [register] = useMutation(REGISTER);
	const [getUser, { loading: loadingGetUser }] = useLazyQuery(GET_USER);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const onLogin = React.useCallback(
		async (payload: LoginT) => {
			setIsLoading(true);
			await login({
				variables: {
					userData: { email: payload.email, password: payload.password },
				},
			})
				.then((res) => {
					const data = JSON.parse(res.data.login);
					getUser({ variables: { getUserByIdId: data.id } })
						.then((res) => {
							console.log("TOKEN", data.token);
							setJwt(data.token);
							setUser(res?.data?.getUserById);
							localStorage.setItem("jwt", data.token);
							localStorage.setItem(
								"user",
								JSON.stringify(res?.data?.getUserById)
							);
							setIsLoading(false);
						})

						.catch(() => {
							setError(errors.getUser);
							setIsLoading(false);
							toast.error(errors.getUser);
						});
				})
				.catch(() => {
					setError(errors.login);
					setIsLoading(false);
					toast.error(errors.login);
				});
		},
		[getUser, login]
	);

	const onRegister = React.useCallback(
		async (payload: UserInput) => {
			setIsLoading(true);
			await register({
				variables: {
					newUserData: payload,
				},
			})
				.then((res) => {
					if (res.data) {
						toast.success("Votre inscription a bien été pris en compte.");
						router.push("/login");
					}
					setIsLoading(false);
				})
				.catch(() => {
					setError(errors.register);
					setIsLoading(false);
					toast.error(errors.register);
				});
		},
		[register]
	);

	const onLogout = React.useCallback(() => {
		router.push("/");
		localStorage.clear();
		setUser(undefined);
		setJwt(undefined);
	}, []);

	React.useEffect(() => {
		if (jwt) {
			window.localStorage.setItem("jwt", jwt);
		}
		if (user) {
			window.localStorage.setItem("user", JSON.stringify(user));
		}
	}, [jwt, user]);

	React.useEffect(() => {
		async function restore() {
			setIsLoading(true);
			await checkSession()
				.then((res) => {
					if (!res?.data?.checkSession) {
						onLogout();
					}
				})
				.catch(() => {
					onLogout();
					toast.error("Une erreur est survenue.");
				});
			const storedToken = window.localStorage.getItem("jwt");
			const storedUser = window.localStorage.getItem("user");
			setJwt(storedToken ? storedToken : defaultStore["jwt"]);
			setUser(storedUser ? JSON.parse(storedUser) : defaultStore["user"]);
			setIsLoading(false);
		}

		restore();
	}, [checkSession, onLogout]);

	const loading: boolean = React.useMemo(() => {
		return loadingGetUser || loadingLogin || loadingCheckSession;
	}, [loadingGetUser, loadingLogin, loadingCheckSession]);

	const isAuthenticated = !!user && !!jwt;

	const initialState: any = React.useMemo(
		() => ({
			user,
			jwt,
			error,
			onLogin,
			setUser,
			setError,
			onLogout,
			isAuthenticated,
			loading,
			isLoading,
			onRegister,
		}),
		[
			user,
			jwt,
			error,
			onLogin,
			setUser,
			setError,
			onLogout,
			isAuthenticated,
			loading,
			isLoading,
			onRegister,
		]
	);
	return (
		<UserContext.Provider value={initialState}>{children}</UserContext.Provider>
	);
}

export { UserProvider, useAuth };
