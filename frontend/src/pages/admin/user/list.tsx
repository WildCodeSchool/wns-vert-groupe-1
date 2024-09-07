import { useMutation, useQuery } from "@apollo/client";
import { IconButton, Modal, Select, RoundedBox } from "@components";
import {
	Box,
	CircularProgress,
	Grid,
	MenuItem,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import { GET_ALL_USERS } from "@queries";
import { mainTheme } from "@theme";
import { UserType } from "@types";
import { errors, useAuth } from "context";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_USER_BY_ID, UPDATE_USER_ROLE_BY_ID } from "@mutations";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "utils";

const columns: { key: any; name: string }[] = [
	{
		key: "lastname",
		name: "Nom",
	},
	{
		key: "firstname",
		name: "Prénom",
	},
	{
		key: "email",
		name: "Email",
	},
	{
		key: "city",
		name: "Ville",
	},
];

const roles: { key: any; name: string }[] = [
	{
		key: "CITYADMIN",
		name: "Administrateur de ville",
	},
	{
		key: "ADMIN",
		name: "Administrateur",
	},
	{
		key: "SUPERUSER",
		name: "Super utilisateur",
	},
	{
		key: "USER",
		name: "Utilisateur",
	},
];

const UsersList = () => {
	const { isAuthenticated, isLoadingSession, user } = useAuth();
	const router = useRouter();

	const [open, setOpen] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<UserType | undefined>(
		undefined
	);

	const { data: users, loading } = useQuery(GET_ALL_USERS, {
		fetchPolicy: "cache-and-network",
	});
	const [deleteUser] = useMutation(DELETE_USER_BY_ID, {
		refetchQueries: [{ query: GET_ALL_USERS }],
	});

	const [updateUserRole] = useMutation(UPDATE_USER_ROLE_BY_ID, {
		refetchQueries: [{ query: GET_ALL_USERS }],
	});

	useLayoutEffect(() => {
		if (!isLoadingSession) {
			if (!isAuthenticated) {
				router.replace("/");
			} else {
				if (user?.role !== "ADMIN" && user?.role !== "CITYADMIN") {
					router.replace("/");
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingSession, isAuthenticated, user?.role]);

	const handleDeleteUser = (userId: string) => {
		deleteUser({
			variables: { deleteUserByIdId: userId },
		})
			.then(() => {
				setOpen(false);
				toast.success(
					`L'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} a bien été supprimé !`
				);
				setSelectedUser(undefined);
			})
			.catch((err) => {
				toast.error(
					`Une erreur est survenue lors de la suppression de l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName}.`
				);
				console.error(err);
			});
	};

	const handleUpdateUserRole = (userId: string, role: string) => {
		updateUserRole({
			variables: { updateUserByIdId: userId, newUserInput: { role: role } },
		})
			.then(() => {
				setOpen(false);
				toast.success(
					`L'utilisateur ${selectedUser?.firstName && selectedUser?.lastName ? selectedUser.firstName + " " + selectedUser.lastName : ""} a bien été modifié !`
				);
			})
			.catch((err) => {
				toast.error(
					`Une erreur est survenue lors de la modification de l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName}.`
				);
				console.error(err);
			})
			.finally(() => {
				setSelectedUser(undefined);
			});
	};

	return loading ? (
		<CircularProgress />
	) : user?.role === "ADMIN" || user?.role === "CITYADMIN" ? (
		<Grid
			container
			marginX={10}
			paddingX={10}
			paddingBottom={5}
			paddingTop={10}
			flex={1}
			flexDirection="column"
			gap={mainTheme.spacing(4)}
		>
			<Grid
				item
				width="100%"
				flexDirection="row"
				display="flex"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography
					variant="h1"
					color={mainTheme.palette.primary.main}
					fontSize={mainTheme.typography.h3.fontSize}
					textTransform="uppercase"
				>
					Utilisateurs
				</Typography>
			</Grid>
			<Grid item width="100%" paddingX={4}>
				<Box
					display="flex"
					flex={1}
					flexDirection="row"
					gap={mainTheme.spacing(4)}
				>
					<RoundedBox
						row
						color="transparent"
						width="70%"
						align="center"
						gap={mainTheme.spacing(8)}
					>
						{columns.map((column, index) => {
							return (
								<Box key={index} width={column.key === "email" ? "30%" : "20%"}>
									<Typography
										key={index}
										accessibility-label={column.key}
										fontWeight="bold"
									>
										{column.name}
									</Typography>
								</Box>
							);
						})}
					</RoundedBox>
					<Box width="20%" alignContent="center" textAlign="center">
						<Typography accessibility-label="role" fontWeight="bold">
							Rôle
						</Typography>
					</Box>
					{user?.role === "ADMIN" ? (
						<Box width="10%" alignContent="center" textAlign="center">
							<Typography accessibility-label="actions" fontWeight="bold">
								Actions
							</Typography>
						</Box>
					) : (
						<></>
					)}
				</Box>
				<Box
					display="flex"
					flex={1}
					flexDirection="column"
					justifyContent="space-between"
					gap={mainTheme.spacing(6)}
					paddingY={10}
				>
					{users?.getAllUsers?.length > 0 ? (
						<>
							{users?.getAllUsers.map((el: UserType, index: number) => {
								return (
									<Box
										key={index}
										display="flex"
										flexDirection="row"
										gap={mainTheme.spacing(6)}
									>
										<RoundedBox
											row
											key={index}
											align="center"
											gap={mainTheme.spacing(8)}
											width="70%"
										>
											<Box width="20%">
												<Typography>{el.lastName}</Typography>
											</Box>
											<Box width="20%">
												<Typography>{el.firstName}</Typography>
											</Box>
											<Box width="30%">
												<Typography>{el.email}</Typography>
											</Box>
											<Box width="20%">
												<Typography>
													{el?.city?.name
														? capitalizeFirstLetter(el.city.name)
														: ""}
												</Typography>
											</Box>
										</RoundedBox>
										<Box textAlign="center" width="20%">
											<Select
												value={el?.role}
												onOpen={() => setSelectedUser(el)}
												onChange={(event: SelectChangeEvent) => {
													if (selectedUser) {
														handleUpdateUserRole(el.id, event.target.value);
													}
												}}
											>
												{roles
													.filter((role) => {
														if (user?.role === "CITYADMIN") {
															return (
																role.key === "SUPERUSER" || role.key === "USER"
															);
														}
														return true;
													})
													.map((role, index) => (
														<MenuItem key={index} value={role.key}>
															{role.name}
														</MenuItem>
													))}
											</Select>
										</Box>
										{user?.role === "ADMIN" ? (
											<Box
												textAlign="center"
												alignContent="center"
												alignItems="center"
												width="10%"
												display="flex"
												flexDirection="row"
												justifyContent="space-evenly"
											>
												<IconButton
													onClick={() => {
														setSelectedUser(el);
														setOpen(true);
													}}
													icon={<DeleteIcon fontSize="small" />}
												/>
											</Box>
										) : (
											<></>
										)}
										<Modal
											open={open}
											setOpen={setOpen}
											onClose={() => {
												setSelectedUser(undefined);
												setOpen(false);
											}}
											onSubmit={() => {
												if (selectedUser) handleDeleteUser(selectedUser.id);
											}}
											submitLabel={
												loading ? "Confirmation en cours..." : "Confirmer"
											}
										>
											<Typography
												id="delete-city-modal-title"
												variant="h4"
												component="h2"
											>
												{`Voulez-vous vraiment supprimer l'utilisateur ${selectedUser?.firstName} ${selectedUser?.lastName} ?`}
											</Typography>
										</Modal>
									</Box>
								);
							})}
						</>
					) : (
						<Typography variant="h4">Aucun utilisateur</Typography>
					)}
				</Box>
			</Grid>
		</Grid>
	) : (
		<Typography>{errors.role}</Typography>
	);
};

export default UsersList;
