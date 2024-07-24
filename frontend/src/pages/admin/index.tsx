import { CircularProgress } from "@mui/material";
import { useAuth } from "context/UserContext";
import { useRouter } from "next/router";
import React from "react";

export default function AdminHome() {
	const { user, isAuthenticated, isLoadingSession } = useAuth();
	const router = useRouter();
	React.useEffect(() => {
		if (!isLoadingSession) {
			if (
				!isAuthenticated &&
				user?.role !== "ADMIN" &&
				user?.role !== "CITYADMIN" &&
				user?.role === "SUPERUSER"
			) {
				router.replace("/");
			}
		}
	}, [user, isAuthenticated, isLoadingSession]);

	return isLoadingSession ? (
		<CircularProgress />
	) : (
		<>
			{user?.role === "ADMIN" ? (
				<p>Admin Dashboard</p>
			) : user?.role === "CITYADMIN" ? (
				<p>CityAdmin Dashboard</p>
			) : user?.role === "SUPERUSER" ? (
				<p>Super Utilisateur Dashboard</p>
			) : (
				<></>
			)}
		</>
	);
}
