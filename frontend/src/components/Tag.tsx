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
				backgroundColor: mainTheme.palette.primary.light,
				borderRadius: "20px",
				border: isActive
					? `2px solid ${mainTheme.palette.primary.main}`
					: "none",
				padding: `${mainTheme.spacing(2)} ${mainTheme.spacing(3)}`,
				boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
				cursor: "pointer",
			}}
		>
			<Typography
				color={mainTheme.palette.primary.main}
				textAlign="center"
				data-testid={name}
			>
				{name}
			</Typography>
		</Paper>
	);
};
