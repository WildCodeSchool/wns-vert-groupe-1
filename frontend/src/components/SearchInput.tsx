import { Box, Typography } from "@mui/material";
import { mainTheme } from "@theme";

type SearchInputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	error?: boolean;
};

export const SearchInput: React.FC<SearchInputProps> = ({
	label,
	name,
	value,
	onChange,
	placeholder,
	error,
}) => (
	<Box display="flex" flexDirection="column">
		<Typography
			sx={{
				fontSize: mainTheme.typography.h6,
				fontWeight: "bold",
				marginBottom: mainTheme.spacing(1),
				color: error
					? mainTheme.palette.error.main
					: mainTheme.palette.secondary.dark,
			}}
		>
			{label}
		</Typography>
		<input
			type="text"
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			style={{
				border: "none",
				outline: "none",
				fontSize: mainTheme.typography.h6.fontSize,
				width: "110px",
				color: mainTheme.palette.primary.main,
				borderBottom: error
					? `1px solid ${mainTheme.palette.error.main}`
					: "none",
			}}
		/>
	</Box>
);
