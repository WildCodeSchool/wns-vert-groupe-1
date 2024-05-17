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
		<Typography
			sx={{
				fontSize: mainTheme.typography.h6,
				fontWeight: "bold",
				marginRight: mainTheme.spacing(2),
				color: error
					? mainTheme.palette.error.main
					: mainTheme.palette.secondary.dark,
			}}
		>
			{label}
		</Typography>
		<InputBase
			type="text"
			fullWidth
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			style={{
				border: "none",
				outline: "none",
				fontSize: mainTheme.typography.h6.fontSize,
				color: mainTheme.palette.primary.main,
				borderBottom: error
					? `1px solid ${mainTheme.palette.error.main}`
					: "none",
			}}
		/>
	</Box>
);
