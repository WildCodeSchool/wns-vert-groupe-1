import { createTheme } from "@mui/material/styles";

export const mainTheme = createTheme({
	palette: {
		primary: {
			main: "#41785D",
			light: "#D3E3D5",
			dark: "#1E3E3D",
			contrastText: "#EEEBE3",
		},
		secondary: {
			main: "#424856",
			light: "#DEE1E6",
		},
		background: {
			default: "#EEEBE3",
			paper: "#FFFFFF",
		},
		warning: {
			main: "#FFE9B2",
		},
		success: {
			main: "#A3E2B5",
		},
		error: {
			main: "#FFB2B2",
		},
	},
	typography: {
		fontFamily: ["Manrope", "Lexend", "sans-serif"].join(","),
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		fontSize: 16,
		h1: {
			fontSize: "90px",
			fontWeight: 500,
		},
		h2: {
			fontSize: "40px",
			fontWeight: 500,
		},
		h3: {
			fontSize: "34px",
			fontWeight: 500,
		},
		h4: {
			fontSize: "20px",
			fontWeight: 500,
		},
		h5: {
			fontSize: "14px",
			fontWeight: 400,
		},
		h6: {
			fontSize: "12px",
			fontWeight: 400,
		},
	},
	spacing: [0, 4, 8, 12, 16, 20, 24, 30, 38],
});
