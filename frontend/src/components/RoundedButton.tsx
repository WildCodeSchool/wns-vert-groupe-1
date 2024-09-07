import { Box, Button } from "@mui/material";
import React from "react";

export const RoundedButton = ({
	label,
	type = "button",
	onClick,
	disabled,
	children,
	color = "primary",
	variant = "contained",
	startIcon,
	tabIndex,
	align = "center",
	justify = "center",
	...props
}: {
	align?: "left" | "center" | "right";
	justify?: "center" | "space-between" | "space-evenly" | "space-around";
	label?: string;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	disabled?: boolean;
	children?: React.ReactNode;
	startIcon?: React.ReactNode;
	tabIndex?: number;
	variant?: "text" | "outlined" | "contained";
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning";
}) => {
	return (
		<Box display="flex" justifyContent={justify} alignItems={align}>
			<Button
				color={color}
				variant={variant}
				tabIndex={tabIndex}
				startIcon={startIcon}
				aria-label={label}
				type={type}
				onClick={onClick}
				disabled={disabled}
				size="large"
				{...props}
				style={{
					borderRadius: "24px",
					cursor: "pointer",
					margin: "16px",
				}}
			>
				{children}
			</Button>
		</Box>
	);
};
