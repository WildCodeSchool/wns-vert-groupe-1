import { Box } from "@mui/material";
import { mainTheme } from "@theme";

type RoundedBoxProps = {
	children?: React.ReactNode;
	color?: string;
	align?: "left" | "center" | "right";
	justify?:
		| "center"
		| "space-between"
		| "space-evenly"
		| "space-aroundly"
		| "end"
		| "right"
		| "start"
		| "left";
	row?: boolean;
};

export default function RoundedBox({
	children,
	color,
	align,
	justify,
	row,
}: RoundedBoxProps) {
	return (
		<Box
			width={"100%"}
			padding={3}
			border={1}
			borderRadius={10}
			borderColor={color ? color : "white"}
			bgcolor={color ? color : "white"}
			textAlign={align ? align : "left"}
			paddingLeft={10}
			justifyContent={justify ? justify : "space-between"}
			flexDirection={row ? "row" : "column"}
			display={"flex"}
		>
			{children}
		</Box>
	);
}
