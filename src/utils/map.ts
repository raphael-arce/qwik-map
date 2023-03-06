import { MapStore } from "../store/map";
import { Point } from "../models";
import { SphericalMercator } from "../geo";

export function getPixelOrigin(store: MapStore): Point {
  const worldSurfaceAtZoomLevel =
    Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const projectedCenter = SphericalMercator.project(
    { lat: store.lat, lng: store.lng },
    worldSurfaceAtZoomLevel,
  );

  const viewHalf = {
    x: store.computedWidth / 2,
    y: store.computedHeight / 2,
  };

  return {
    x: projectedCenter.x - viewHalf.x,
    y: projectedCenter.y - viewHalf.y,
  };
}