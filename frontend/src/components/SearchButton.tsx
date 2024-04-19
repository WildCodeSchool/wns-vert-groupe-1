import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { mainTheme } from "@theme";

export type SearchButtonProps = {
	disabled?: boolean;
};

export const SearchButton = ({ disabled }: SearchButtonProps) => (
	<IconButton
		type="submit"
		aria-label="search"
		disabled={disabled}
		sx={{
			background: mainTheme.palette.primary.light,
			padding: mainTheme.spacing(3),
			"&:hover": {
				background: mainTheme.palette.primary.light,
			},
		}}
	>
		<SearchIcon
			sx={{
				color: mainTheme.palette.primary.main,
				fontSize: "25px",
				opacity: 0.7,
			}}
		/>
	</IconButton>
);
