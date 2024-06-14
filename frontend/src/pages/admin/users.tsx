import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TablePagination,
	Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { GET_ALL_USERS } from "@queries";
import { useQuery, useMutation } from "@apollo/client";
import AdminLayout from "../../components/AdminLayout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { DELETE_USER } from "@mutations";

const UsersAdminPage = () => {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(4);

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

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedUsers = data.getAllUsers.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<AdminLayout>
			<div>
				<h1>Liste des utilisateurs</h1>
				<br />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Prénom</TableCell>
							<TableCell>Nom</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Rôle</TableCell>
							<TableCell>Ville</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedUsers.map((user: any) => (
							<TableRow key={user.id}>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell>
									{user.city ? user.city.name : "Non spécifié"}
								</TableCell>
								<TableCell>
									<Button
										variant="contained"
										color="error"
										onClick={() => handleDeleteUser(user.id)}
										startIcon={<DeleteOutlineIcon />}
										style={{
											margin: "0.5rem",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										Supprimer
									</Button>
									<Button
										variant="contained"
										color="primary"
										onClick={() => handleEditUser(user.id)}
										startIcon={<EditIcon />}
										style={{
											margin: "0.5rem",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										Modifier
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[4, 8, 12]}
					component="div"
					count={data.getAllUsers.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage="Lignes par page"
				/>
			</div>
			<Button variant="contained" onClick={handleCreateNewUser}>
				Créer un nouvel utilisateur
			</Button>
		</AdminLayout>
	);
};

export default UsersAdminPage;
