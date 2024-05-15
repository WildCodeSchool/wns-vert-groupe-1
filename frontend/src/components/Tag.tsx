import React from "react";
import { IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { mainTheme } from "@theme";

type TagProps = {
	name: string;
	onClose: () => void;
};

export const Tag: React.FC<TagProps> = ({ name, onClose }) => {
	return (
		<Paper
			sx={{
				backgroundColor: mainTheme.palette.primary.light,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "20px",
				padding: `${mainTheme.spacing(2)} ${mainTheme.spacing(3)}`,
				boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
			}}
		>
			<IconButton
				onClick={onClose}
				sx={{
					padding: 0,
				}}
			>
				<CloseIcon
					sx={{
						color: mainTheme.palette.primary.main,
						padding: 0,
					}}
				/>
			</IconButton>
			<Typography color={mainTheme.palette.primary.main}>{name}</Typography>
		</Paper>
	);
};
