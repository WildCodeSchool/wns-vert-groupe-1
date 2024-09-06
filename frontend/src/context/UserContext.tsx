import { useLazyQuery, useMutation } from "@apollo/client";
import {
	CHECK_INFO,
	GET_USER_BY_EMAIL,
	LOGIN,
} from "../graphql/queries/queries";
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
	isLoadingSession: boolean;
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
	isLoadingSession: false,
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
	const [checkSession, { loading: loadingCheckSession }] =
		useLazyQuery(CHECK_INFO);
	const [jwt, setJwt] = React.useState(defaultStore["jwt"]);
	const [login, { loading: loadingLogin }] = useLazyQuery(LOGIN);
	const [register, { loading: loadingRegister }] = useMutation(REGISTER);
	const [getUserByEmail, { loading: loadingGetUser }] = useLazyQuery(
		GET_USER_BY_EMAIL,
		{
			fetchPolicy: "cache-and-network",
		}
	);
	const [isLoadingSession, setIsLoadingSession] = React.useState<boolean>(true);

	const onLogin = React.useCallback(
		async (payload: LoginT) => {
			setIsLoadingSession(true);
			await login({
				variables: {
					userData: { email: payload.email, password: payload.password },
				},
			})
				.then((res) => {
					const data = JSON.parse(res.data.login);
					getUserByEmail({ variables: { email: payload.email } })
						.then((res) => {
							setJwt(data.token);
							setUser(res?.data?.getUserByEmail);
							localStorage.setItem("jwt", data.token);
							setIsLoadingSession(false);
							toast.success("Connexion réussie !");
							if (
								res?.data?.getUserByEmail.role === "ADMIN" ||
								res?.data?.getUserByEmail.role === "CITYADMIN"
							) {
								router.replace("/admin/user/list");
							} else if (res?.data?.getUserByEmail?.role === "SUPERUSER") {
								router.replace("/admin/poi/list");
							} else {
								router.replace("/");
							}
						})
						.catch(() => {
							setError(errors.getUser);
							setIsLoadingSession(false);
							toast.error(errors.getUser);
						});
				})
				.catch(() => {
					setError(errors.login);
					setIsLoadingSession(false);
					toast.error(errors.login);
				});
		},
		[getUserByEmail, login]
	);

	const onRegister = React.useCallback(
		async (payload: UserInput) => {
			setIsLoadingSession(true);
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
					setIsLoadingSession(false);
				})
				.catch(() => {
					setError(errors.register);
					setIsLoadingSession(false);
					toast.error(errors.register);
				});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[register]
	);

	const onLogout = React.useCallback(() => {
		localStorage.clear();
		setUser(undefined);
		setJwt(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (jwt) {
			window.localStorage.setItem("jwt", jwt);
		}
	}, [jwt]);

	React.useEffect(() => {
		async function restore() {
			setIsLoadingSession(true);
			await checkSession()
				.then((res) => {
					if (!res?.data?.checkSession?.isLoggedIn) {
						onLogout();
					} else {
						getUserByEmail({
							variables: { email: res?.data?.checkSession.email },
						})
							.then((result) => {
								setUser(result?.data?.getUserByEmail);
							})
							.catch(() => onLogout());
					}
				})
				.catch(() => {
					onLogout();
					toast.error("Une erreur est survenue.");
				});
			const storedToken = window.localStorage.getItem("jwt");
			setJwt(storedToken ? storedToken : defaultStore["jwt"]);
			setIsLoadingSession(false);
		}

		restore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkSession, onLogout]);

	const loading: boolean = React.useMemo(() => {
		return (
			loadingGetUser || loadingLogin || loadingCheckSession || loadingRegister
		);
	}, [loadingGetUser, loadingLogin, loadingCheckSession, loadingRegister]);

	const isAuthenticated = !!jwt;

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
			isLoadingSession,
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
			isLoadingSession,
			onRegister,
		]
	);
	return (
		<UserContext.Provider value={initialState}>{children}</UserContext.Provider>
	);
}

export { UserProvider, useAuth };
