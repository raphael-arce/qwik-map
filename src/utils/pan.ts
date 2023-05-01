import { LatLng, Point } from '../models';
import { add } from '../geometry';
import { SphericalMercator } from '../projection';
import { MapStore } from '../store';
import { getWorldSurfaceAtZoomLevel } from './map';

export function getNewMapCenter(panDifference: Point, store: MapStore): LatLng {
  const newRelativeCenter = add(store.computedCenter, panDifference);
  const newWorldCenter = add(store.pixelOrigin, newRelativeCenter);

  return SphericalMercator.unproject(newWorldCenter, getWorldSurfaceAtZoomLevel(store));
}
