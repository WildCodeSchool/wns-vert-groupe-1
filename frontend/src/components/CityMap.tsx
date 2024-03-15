"use client";
import { Map, Marker } from "react-map-gl";

export type CityMapProps = {
	lat?: number;
	lon?: number;
	pois?: {
		id: number;
		name: string;
		address: string;
		description: string;
		latitude: number;
		longitude: number;
	}[];
};

export const CityMap = ({ lat, lon, pois }: CityMapProps) => {
	const key = `${lat}-${lon}`;

	return (
		<>
			<Map
				key={key}
				mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
				latitude={lat}
				longitude={lon}
				zoom={10}
				style={{ width: 1000, height: 500 }}
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
		</>
	);
};
export default CityMap;