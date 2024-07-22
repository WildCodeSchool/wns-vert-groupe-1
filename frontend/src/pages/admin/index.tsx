import { useAuth } from "context/UserContext";
import { useRouter } from "next/router";
import React from "react";

export default function AdminHome() {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (!isLoading) {
			if (
				!isAuthenticated &&
				user?.role !== "ADMIN" &&
				user?.role !== "CITYADMIN" &&
				user?.role === "SUPERUSER"
			) {
				router.replace("/");
			}
		}
	}, [user, isAuthenticated, isLoading]);

	return (
		<>
			<p>DashBoard</p>
			{user?.role === "ADMIN" ? (
				<p>Admin Dashboard</p>
			) : user?.role === "CITYADMIN" ? (
				<p>CityAdmin Dashboard</p>
			) : user?.role === "SUPERUSER" ? (
				<></>
			) : (
				<></>
			)}
		</>
	);
}
