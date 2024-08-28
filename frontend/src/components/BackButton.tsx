import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/router";
import { Box } from "@mui/material";

type BackButtonProps = {
	color?: string;
};

export const BackButton = ({ color }: BackButtonProps) => {
	const router = useRouter();
	return (
		<Box width="100%" paddingY={10} display="flex" justifyContent="flex-start">
			<ArrowBackIosIcon
				aria-label="Retourner à la page précédente"
				onClick={() => router.back()}
				sx={{ cursor: "pointer", color: color ? color : "primary.main" }}
			/>
		</Box>
	);
};
