import React from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { mainTheme } from "@theme";

type IconButtonProps = {
	onClick: () => void;
	icon: React.ReactNode;
	color?: string;
	size?: number;
	sx?: SxProps<Theme>;
	rounded?: boolean;
};

export const IconButton = ({
	onClick,
	icon,
	color = "white",
	size = 35,
	sx,
	rounded = true,
}: IconButtonProps) => {
	return (
		<MuiIconButton
			onClick={onClick}
			sx={{
				color: color,
				backgroundColor: mainTheme.palette.primary.contrastText,
				borderRadius: rounded ? "50%" : "0%",
				cursor: "pointer",
				width: size,
				height: size,
				padding: 1,
				...sx,
				"&:hover": {
					backgroundColor: mainTheme.palette.primary.dark,
				},
			}}
		>
			{icon}
		</MuiIconButton>
	);
};

export default IconButton;
