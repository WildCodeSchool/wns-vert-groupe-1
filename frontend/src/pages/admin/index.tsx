import { useAuth } from "context/UserContext";
import { useRouter } from "next/router";
import React from "react";

export default function AdminHome() {
	const { user } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (user?.role !== "ADMIN" && user?.role !== "CITYADMIN") {
			router.replace("/");
		}
	}, [user]);

	return (
		<>
			<p>DashBoard</p>
			{user?.role === "ADMIN" ? (
				<p>Admin Dashboard</p>
			) : user?.role === "CITYADMIN" ? (
				<p>CityAdmin Dashboard</p>
			) : (
				<></>
			)}
		</>
	);
}
