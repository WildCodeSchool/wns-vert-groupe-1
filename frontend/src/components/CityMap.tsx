"use client";

import Map from "react-map-gl";

export type CityMapProps = {
	id?: number;
	lat: number;
	lon: number;
};

const CityMap = ({ lat, lon }: CityMapProps) => {
    return (
        <>
        <Map
          mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
          initialViewState={{
            longitude: lon,
            latitude: lat,
            zoom: 10
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
        </>
        );
}

export default CityMap;

    