"use client";
import { Map, Marker } from "react-map-gl";
import { CityType } from "@types";

export const CityMap = ({ lat, lon, pois }: CityType) => {
	const key = `${lat}-${lon}`;

	return (
		<div style={{ flex: 1 }}>
			<Map
				key={key}
				mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
				latitude={lat}
				longitude={lon}
				zoom={10}
				mapStyle="mapbox://styles/mapbox/dark-v11"
			>
				{pois &&
					pois.length > 0 &&
					pois.map(
						(poi) =>
							poi.latitude !== undefined &&
							poi.longitude !== undefined && (
								<Marker
									key={poi.id}
									latitude={poi.latitude}
									longitude={poi.longitude}
								/>
							)
					)}
			</Map>
		</div>
	);
};
export default CityMap;
