import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS } from "@queries";
import { DELETE_USER } from "@mutations";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import AdminLayout from "../../components/AdminLayout";

const UsersAdminPage = () => {
	const router = useRouter();

	const { loading, error, data } = useQuery(GET_ALL_USERS);
	const [deleteUser] = useMutation(DELETE_USER, {
		refetchQueries: [{ query: GET_ALL_USERS }],
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const handleCreateNewUser = () => {
		router.push("/admin/new");
	};

	const handleEditUser = (userId: string) => {
		router.push(`/admin/${userId}`);
	};

	const handleDeleteUser = (userId: string) => {
		deleteUser({ variables: { userId: userId.toString() } });
	};

	return (
		<AdminLayout>
			{" "}
			<div>
				<h1>Liste des utilisateurs</h1>
				<br />
				<ul>
					{data.getAllUsers.map((user: any) => (
						<li key={user.id}>
							<p>Prénom: {user.firstName}</p>
							<p>Nom: {user.lastName}</p>
							<p>Email: {user.email}</p>
							<p>Rôle: {user.role}</p>
							<p>Ville: {user.city ? user.city.name : "Non spécifié"}</p>

							<Button
								variant="contained"
								color="error"
								onClick={() => handleDeleteUser(user.id)}
								style={{ margin: "0.5rem" }}
							>
								Supprimer
							</Button>

							<Button
								variant="contained"
								color="primary"
								onClick={() => handleEditUser(user.id)}
								style={{ margin: "0.5rem" }}
							>
								Modifier
							</Button>
						</li>
					))}
					<Button variant="contained" onClick={handleCreateNewUser}>
						Créer un nouvel utilisateur
					</Button>
				</ul>
			</div>
		</AdminLayout>
	);
};

export default UsersAdminPage;
