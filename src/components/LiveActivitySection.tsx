import type * as GeoJSON from "geojson";
import { Car } from "lucide-react";
import { Map, MapGeoJSON, MapMarker, MarkerContent } from "./ui/map";

const ESTATE_CENTER: [number, number] = [3.4732, 6.4392];
const GEOFENCE_RADIUS_KM = 0.35;

function createGeofenceCircle(
  center: [number, number],
  radiusKm: number,
  points = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const distanceX = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  const ring: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    ring.push([lng + distanceX * Math.cos(theta), lat + distanceY * Math.sin(theta)]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [ring] },
  };
}

const geofenceGeoJSON = createGeofenceCircle(ESTATE_CENTER, GEOFENCE_RADIUS_KM);

function VehicleMarker() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-md">
      <Car size={13} className="text-white" strokeWidth={2.25} />
    </div>
  );
}

function GeofencePin() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-[13px] font-bold text-white shadow-lg">
        A
      </div>
      <div className="-mt-1 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-700" />
    </div>
  );
}

export function LiveMapCard() {
  const vehiclePosition: [number, number] = [
    ESTATE_CENTER[0] - 0.0028,
    ESTATE_CENTER[1] + 0.0021,
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[20px] font-semibold leading-[130%] text-black">Live Active Map</h2>
      <div className="h-[335px] w-full overflow-hidden rounded-[20px] border border-gray-200">
        <Map center={ESTATE_CENTER} zoom={15}>
          <MapGeoJSON
            data={geofenceGeoJSON}
            fillPaint={{ "fill-color": "#1E3A8A", "fill-opacity": 0.08 }}
            linePaint={{ "line-color": "#1E3A8A", "line-width": 1.5 }}
          />
          <MapMarker longitude={ESTATE_CENTER[0]} latitude={ESTATE_CENTER[1]}>
            <MarkerContent>
              <GeofencePin />
            </MarkerContent>
          </MapMarker>
          <MapMarker longitude={vehiclePosition[0]} latitude={vehiclePosition[1]}>
            <MarkerContent>
              <VehicleMarker />
            </MarkerContent>
          </MapMarker>
        </Map>
      </div>
    </div>
  );
}

interface AlertItem {
  title: string;
  description: string;
}

const DEMO_ALERTS: AlertItem[] = [
  { title: "Trip delayed", description: "The essence here is controlled trip initiation." },
  { title: "Trip delayed", description: "The essence here is controlled trip initiation." },
  { title: "Trip delayed", description: "The essence here is controlled trip initiation." },
  { title: "Trip delayed", description: "The essence here is controlled trip initiation." },
];

export function AlertsOverlay({ alerts = DEMO_ALERTS }: { alerts?: AlertItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[20px] font-semibold leading-[130%] text-black">Alerts overlay</h2>
      <div className="flex h-[335px] flex-col gap-[17px] overflow-y-auto pr-1">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-white px-3 py-2.5 flex-shrink-0"
            style={{ border: "0.5px solid rgba(51,65,85,0.1)" }}
          >
            <p className="text-[16px] font-medium leading-[150%] text-[#0F172A]">{alert.title}</p>
            <p className="mt-1 text-[14px] font-normal leading-[150%] text-[#64748B]" style={{ letterSpacing: "0.0025em" }}>
              {alert.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveActivitySection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
      <LiveMapCard />
      <AlertsOverlay />
    </div>
  );
}
