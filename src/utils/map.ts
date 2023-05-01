import { MapStore } from '../store';
import { Point } from '../models';
import { SphericalMercator } from '../projection';
import { subtract, round } from '../geometry';

export function getPixelOrigin(store: MapStore): Point {
  const projectedCenter = round(
    SphericalMercator.project({ lat: store.lat, lng: store.lng }, getWorldSurfaceAtZoomLevel(store)),
  );

  return subtract(projectedCenter, store.computedCenter);
}

export function getWorldSurfaceAtZoomLevel(store: MapStore): number {
  return Math.pow(2, store.zoom) * store.tileProvider.tileSize;
}
