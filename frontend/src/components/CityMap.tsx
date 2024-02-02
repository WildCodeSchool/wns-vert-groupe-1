"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type mapProps = {
	id?: number;
	lat: number;
	lon: number;
};

const CityMap = ({ lat, lon }: mapProps) => {
    return (
        <>
        <Map
          mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
          initialViewState={{
            longitude: lon,
            latitude: lat,
            zoom: 14
          }}
          style={{width: 600, height: 400}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
        </>
        );
}

export default CityMap;

    