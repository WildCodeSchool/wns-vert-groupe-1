import { Box } from "@mui/material";

type RoundedBoxProps = {
	children?: React.ReactNode;
	color?: string;
	align?: "left" | "center" | "right";
	justify?:
		| "center"
		| "space-between"
		| "space-evenly"
		| "space-around"
		| "end"
		| "right"
		| "start"
		| "left";
	row?: boolean;
	width?: number | string;
	display?: string;
	gap?: number | string;
	paddingX?: number | string;
};

export const RoundedBox = ({
	children,
	color = "white",
	align = "left",
	justify = "space-between",
	row,
	width = "100%",
	paddingX = 0,
	display = "flex",
	gap = 0,
}: RoundedBoxProps) => {
	return (
		<Box
			width={width}
			paddingY={4}
			border={1}
			borderRadius={10}
			borderColor={color}
			bgcolor={color}
			textAlign={align}
			flexDirection={row ? "row" : "column"}
			paddingX={paddingX}
			display={display}
			gap={gap}
			justifyContent={justify}
			alignItems="center"
		>
			{children}
		</Box>
	);
};
