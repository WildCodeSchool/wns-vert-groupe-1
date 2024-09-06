import { Box, Button, Modal as MuiModal } from "@mui/material";

type ModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	children: React.ReactNode;
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

export const Modal = ({ open, setOpen, children }: ModalProps) => {
	return (
		<MuiModal
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby="delete-city-modal-title"
		>
			<Box sx={style}>{children}</Box>
		</MuiModal>
	);
};
