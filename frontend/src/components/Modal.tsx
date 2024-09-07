import { Box, Modal as MuiModal, Typography } from "@mui/material";
import { RoundedButton } from "./RoundedButton";
import { mainTheme } from "@theme";

type ModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children: React.ReactNode;
	onClose?: () => void;
	onSubmit?: () => void;
	submitLabel: string;
};

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	bgcolor: "background.paper",
	borderRadius: "2rem",
	border: "2px solid white",
	p: 7,
	gap: 5,
};

export const Modal = ({
	open,
	setOpen,
	children,
	onClose,
	onSubmit,
	submitLabel,
}: ModalProps) => {
	return (
		<MuiModal
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby="delete-city-modal-title"
		>
			<Box sx={style}>
				{children}
				<Box gap={mainTheme.spacing(8)} display="flex">
					<RoundedButton
						label="Annuler la suppression"
						color="error"
						onClick={onClose}
					>
						<Typography color="white">Annuler</Typography>
					</RoundedButton>
					<RoundedButton
						label="Confirmer la suppression"
						color="primary"
						onClick={onSubmit}
					>
						<Typography color="white">{submitLabel}</Typography>
					</RoundedButton>
				</Box>
			</Box>
		</MuiModal>
	);
};
