import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapboxMap() {
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
  const mapNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = mapNode.current;
    if (!window || !node) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken:'pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  return <div ref={mapNode} style={{ width: '100%', height: '100%' }} />;
}

export default MapboxMap;
