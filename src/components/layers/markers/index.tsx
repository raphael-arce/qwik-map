import { component$, useContext } from "@builder.io/qwik";
import { LatLng } from "../../../models";
import { MapStore, QwikMapContext } from "../../../store";
import { round, subtract } from "../../../geometry";
import { SphericalMercator } from "../../../projection";

export type MarkerProps = {
  lat: number;
  lng: number;
}

export function getMarkerPosition(store: MapStore, props: MarkerProps) {
  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const projectedPosition = round(SphericalMercator.project({ lat: store.lat, lng: store.lng }, worldSurfaceAtZoomLevel));

  return subtract(projectedPosition, store.computedCenter)
}

export const Marker = component$((props: MarkerProps) => {
  const store: MapStore = useContext(QwikMapContext);

  const position = getMarkerPosition(store, props)

  return <div style="background:#f00;width:20px;height:20px;border-radius:50%;"/>
});