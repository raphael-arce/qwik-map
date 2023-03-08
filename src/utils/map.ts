import { MapStore } from '../store/map';
import { Point } from '../models';
import { SphericalMercator } from '../projection';
import { subtract, round } from '../geometry';

export function getPixelOrigin(store: MapStore): Point {
  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const projectedCenter = round(SphericalMercator.project({ lat: store.lat, lng: store.lng }, worldSurfaceAtZoomLevel));

  return subtract(projectedCenter, store.computedCenter);
}
