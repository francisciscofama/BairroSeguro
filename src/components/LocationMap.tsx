import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/LocationMap")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/LocationMap"!</div>;
}

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationMap() {
  const [position, setPosition] = useState<[number, number]>([-8.8383, 13.2344]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition([location.coords.latitude, location.coords.longitude]);
      },
      (error) => {
        console.log("Não foi possível obter a localização:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-border">
      <MapContainer
        key={position.join(",")}
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={position}
          radius={9}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#2563eb",
            fillOpacity: 1,
            weight: 4,
          }}
        >
          <Popup>A sua localização actual</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
