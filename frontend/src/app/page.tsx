// page.js
"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import classes from "./Page.module.css";

export default function Home() {
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

	return (
    <>
    <h5>cc</h5>
		<main className={classes.mainStyle}>
			<Map
				mapboxAccessToken={mapboxToken}
				mapStyle="mapbox://styles/mapbox/streets-v12"
				initialViewState={{ latitude: 35.668641, longitude: 139.750567, zoom: 10 }}
				maxZoom={20}
				minZoom={3}
			></Map>
		</main>
    </>
	);
}
