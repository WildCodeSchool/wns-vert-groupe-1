import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "@components";

const UserAdminPage = () => {
	const router = useRouter();
	const authInfo = useContext(UserContext);
	if (authInfo.role !== "admin") {
		router.push("/login");
	}

	return (
		<>
			<p>Admin User Page</p>
		</>
	);
};

export default UserAdminPage;
