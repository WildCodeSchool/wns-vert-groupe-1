import React from "react";

type LogoProps = {
	style?: React.CSSProperties;
	[key: string]: any;
};

const Logo: React.FC<LogoProps> = ({ style, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		width="98px"
		height="68px"
		style={{
			shapeRendering: "geometricPrecision",
			textRendering: "geometricPrecision",
			imageRendering: "auto",
			fillRule: "evenodd",
			clipRule: "evenodd",
			...style,
		}}
		xmlnsXlink="http://www.w3.org/1999/xlink"
		{...props}
	>
		<g>
			<path
				style={{ opacity: 0.902 }}
				fill="#aeccb2"
				d="M 46.5,35.5 C 46.1667,35.5 45.8333,35.5 45.5,35.5C 45.1667,35.5 44.8333,35.5 44.5,35.5C 44.5,34.8333 44.1667,34.5 43.5,34.5C 39.5803,29.9081 37.7469,24.5748 38,18.5C 38.956,17.4214 39.7894,16.2547 40.5,15C 47.502,12.8862 51.8353,15.2196 53.5,22C 51.5049,26.8282 49.1715,31.3282 46.5,35.5 Z M 43.5,18.5 C 48.0408,18.8152 49.0408,20.6485 46.5,24C 42.5369,24.1177 41.5369,22.2843 43.5,18.5 Z"
			/>
		</g>
		<g>
			<path
				style={{ opacity: 0.947 }}
				fill="#ede9e3"
				d="M 46.5,35.5 C 49.1873,35.6641 51.854,35.4974 54.5,35C 60.0107,31.4839 65.5107,27.9839 71,24.5C 78.9407,27.0124 80.4407,31.679 75.5,38.5C 69.6562,43.2559 62.9895,44.7559 55.5,43C 52.8137,41.6322 50.147,40.2989 47.5,39C 46.6634,37.9887 46.33,36.8221 46.5,35.5 Z"
			/>
		</g>
		<g>
			<path
				style={{ opacity: 0.9 }}
				fill="#eeeae3"
				d="M 43.5,34.5 C 43.5,34.8333 43.5,35.1667 43.5,35.5C 39.7626,38.1215 37.096,41.6215 35.5,46C 29.9057,47.9132 27.739,46.0798 29,40.5C 32.4336,35.2957 37.2669,33.2957 43.5,34.5 Z"
			/>
		</g>
		<g>
			<path
				style={{ opacity: 0.932 }}
				fill="#eee9e3"
				d="M 43.5,35.5 C 43.8333,35.5 44.1667,35.5 44.5,35.5C 44.8333,35.5 45.1667,35.5 45.5,35.5C 46.3931,42.4118 50.0598,47.4118 56.5,50.5C 59.0734,59.2148 56.0734,62.0481 47.5,59C 41.1555,52.1032 39.8222,44.2699 43.5,35.5 Z"
			/>
		</g>
	</svg>
);

export default Logo;