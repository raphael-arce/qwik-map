import { MapStore } from '../store';
import { Point } from '../models';
import { add, subtract } from '../geometry';
import { midpoint } from '../geometry/operations';
import { SphericalMercator } from '../projection';
import { getWorldSurfaceAtZoomLevel } from './map';

export function getNewZoomInCenter(zoomInPoint: Point, store: MapStore) {
  const zoomInPointWorldPosition = add(store.pixelOrigin, zoomInPoint);

  const oldMapCenter = add(store.pixelOrigin, store.computedCenter);
  const newMapCenter = midpoint(zoomInPointWorldPosition, oldMapCenter);

  return SphericalMercator.unproject(newMapCenter, getWorldSurfaceAtZoomLevel(store));
}

export function getNewZoomOutCenter(zoomOutPoint: Point, store: MapStore) {
  const zoomOutPointWorldPosition = add(store.pixelOrigin, zoomOutPoint);

  const oldMapCenter = add(store.pixelOrigin, store.computedCenter);
  const newMapCenter = subtract(oldMapCenter, subtract(zoomOutPointWorldPosition, oldMapCenter));

  return SphericalMercator.unproject(newMapCenter, getWorldSurfaceAtZoomLevel(store));
}
