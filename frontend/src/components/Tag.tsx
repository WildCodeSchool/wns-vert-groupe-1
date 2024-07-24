import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { mainTheme } from "@theme";

type TagProps = {
	name: string;
	isActive: boolean;
	onClick: () => void;
};

export const Tag: React.FC<TagProps> = ({ name, isActive, onClick }) => {
	return (
		<Paper
			onClick={onClick}
			sx={{
				backgroundColor: isActive
					? mainTheme.palette.primary.dark
					: mainTheme.palette.primary.light,
				borderRadius: "20px",
				border: `2px solid ${mainTheme.palette.primary.dark}`,
				padding: `${mainTheme.spacing(2)} ${mainTheme.spacing(3)}`,
				boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
				cursor: "pointer",
			}}
		>
			<Typography
				color={
					isActive
						? mainTheme.palette.primary.light
						: mainTheme.palette.primary.dark
				}
				textAlign="center"
			>
				{name}
			</Typography>
		</Paper>
	);
};
