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
};

export default function RoundedBox({
	children,
	color = "white",
	align = "left",
	justify = "space-between",
	row,
}: RoundedBoxProps) {
	return (
		<Box
			width="100%"
			padding={3}
			border={1}
			borderRadius={10}
			borderColor={color}
			bgcolor={color}
			textAlign={align}
			paddingLeft={10}
			justifyContent={justify}
			flexDirection={row ? "row" : "column"}
			display="flex"
		>
			{children}
		</Box>
	);
}
