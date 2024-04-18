import { Button as Btn, ButtonOwnProps } from "@mui/material";
import { mainTheme } from "@theme";
import { FormEvent } from "react";

type ButtonProps = {
	variant?: "text" | "contained" | "outlined";
	disabled?: boolean;
	href?: string;
	onClick: any;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning";
	size?: "small" | "medium" | "large";
	startIcon?: any;
	endIcon?: any;
	children: React.ReactNode;
	style?: any;
};

export const Button = (props: ButtonProps) => {
	return (
		<Btn
			variant={props.variant || "text"}
			disabled={props.disabled || false}
			color={props.color || "primary"}
			size={props.size || "small"}
			onClick={props.onClick}
			href={props.href || undefined}
			startIcon={props.startIcon || undefined}
			endIcon={props.endIcon || undefined}
			style={props.style}
		>
			{props.children}
		</Btn>
	);
};
