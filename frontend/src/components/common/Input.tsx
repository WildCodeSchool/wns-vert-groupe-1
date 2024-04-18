import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

type InputProps = TextFieldProps & {
	id: string;
	label?: string;
	variant?: "outlined" | "filled" | "standard";
	required?: boolean;
	defaultValue?: string;
	type?: "text" | "number" | "password" | "search" | "file" | "date";
	helperText?: string;
	disabled?: boolean;
	//*
	InputProps?: any;
	InputLabelProps?: any;
	error?: boolean;
	multiline?: boolean;
	rows?: number;
	maxRows?: number;
	placeholder?: string;
	select?: boolean;
	options?: any;
	//*
	SelectProps?: any;
	fullWidth?: boolean;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
};

export const Input = (inputProps: InputProps) => {
	return (
		<div>
			<TextField
				id={inputProps.id ? inputProps.id : undefined}
				label={inputProps.label ? inputProps.label : undefined}
				variant={inputProps.variant ? inputProps.variant : "standard"}
				type={inputProps.type ? inputProps.type : "text"}
				defaultValue={
					inputProps.defaultValue ? inputProps.defaultValue : undefined
				}
				placeholder={
					inputProps.placeholder ? inputProps.placeholder : undefined
				}
				required={inputProps.required || false}
				helperText={inputProps.helperText ? inputProps.helperText : undefined}
				disabled={inputProps.disabled || false}
				multiline={inputProps.multiline || false}
				rows={inputProps.rows || undefined}
				maxRows={inputProps.maxRows || undefined}
				select={inputProps.select || undefined}
				error={inputProps.error || undefined}
				InputProps={inputProps.InputProps || undefined}
				fullWidth={inputProps.fullWidth || true}
				onChange={inputProps.onChange}
			/>
		</div>
	);
};

// export default Input;
