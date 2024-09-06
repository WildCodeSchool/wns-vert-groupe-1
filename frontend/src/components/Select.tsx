import {
	FormControl,
	InputLabel,
	Select as MuiSelect,
	SelectChangeEvent,
} from "@mui/material";
import { SyntheticEvent } from "react";

type SelectProps = {
	value: string;
	children: React.ReactNode;
	onChange: (event: SelectChangeEvent) => void;
	onOpen?: (event: SyntheticEvent<Element, Event>) => void;
	label?: string;
};

export const Select = ({
	value,
	children,
	onChange,
	label,
	onOpen,
}: SelectProps) => {
	return (
		<FormControl>
			<InputLabel id="select-label">{label}</InputLabel>
			<MuiSelect
				id="select"
				value={value}
				label="Rôle"
				sx={{
					width: "250px",
					minWidth: "200px",
					backgroundColor: "white",
					borderColor: "white",
					borderRadius: 10,
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "white",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "white",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "white",
					},
				}}
				inputProps={{ "aria-label": label }}
				onChange={onChange}
				onOpen={onOpen}
			>
				{children}
			</MuiSelect>
		</FormControl>
	);
};
