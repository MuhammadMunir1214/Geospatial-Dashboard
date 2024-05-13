import "mapbox-gl/dist/mapbox-gl.css"; // Ensure CSS is included
import "./App.css";
import mapboxgl from "mapbox-gl";
import { useState, useEffect, useRef } from "react";
import { states } from "./states.js";
import * as turf from "@turf/turf"; // Assuming Turf.js is installed and imported

mapboxgl.accessToken =
  "pk.eyJ1IjoibW11bmlyMTIiLCJhIjoiY2x0cjk4eGRwMDR5NTJqcDl2YXo1a3lsNiJ9.OJujc4zPMRQmHF4qQuCObw";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // Ensures the map initializes only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      let geoJsonForm = {
        type: "FeatureCollection",
        features: states.map((element) => ({
          type: "Feature",
          properties: {
            name: element["name"],
            area: element["CENSUSAREA"],
          },
          geometry: {
            type: "Polygon",
            coordinates: element["geometry"],
          },
        })),
      };

      map.current.addSource("states", { type: "geojson", data: geoJsonForm });

      map.current.addLayer({
        id: "states",
        type: "fill",
        source: "states",
        layout: {},
        paint: {
          "fill-color": "#724",
          "fill-opacity": 0.6,
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "custom-popup",
      });

      map.current.on("mouseenter", "states", (e) => {
        try {
          if (e.features.length > 0) {
            const features = e.features[0];
            const polygon = turf.polygon(features.geometry.coordinates);
            const centroid = turf.centroid(polygon);

            const description = features.properties;
            popup
              .setLngLat(centroid.geometry.coordinates)
              .setHTML(
                `<strong>${description.name}</strong><p>${description.name} is ${description.area} square kilometers.</p>`
              )
              .addTo(map.current);
          }
        } catch (error) {
          console.error("Error displaying popup:", error);
        }
      });

      map.current.on("mouseleave", "states", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [lng, lat, zoom]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
