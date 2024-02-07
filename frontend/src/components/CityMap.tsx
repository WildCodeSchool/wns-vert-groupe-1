"use client";

import Map from "react-map-gl";
import { CityMapProps } from "@types";

export const CityMap = ({ lat, lon }: CityMapProps) => {
	return (
		<>
			<Map
				mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
				initialViewState={{
					longitude: lon,
					latitude: lat,
					zoom: 10,
				}}
				style={{ width: 1000, height: 500 }}
				mapStyle="mapbox://styles/mapbox/streets-v9"
			/>
		</>
	);
};
