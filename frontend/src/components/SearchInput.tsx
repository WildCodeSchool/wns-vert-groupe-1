import { Box, InputBase, Typography } from "@mui/material";
import { mainTheme } from "@theme";

type SearchInputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	error?: boolean;
};

export const SearchInput = ({
	label,
	name,
	value,
	onChange,
	placeholder,
	error,
}: SearchInputProps) => (
	<Box display="flex">
		<InputBase
			type="text"
			fullWidth
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			style={{
				outline: "none",
				fontSize: mainTheme.typography.h6.fontSize,
				color: mainTheme.palette.primary.main,
			}}
		/>
	</Box>
);
