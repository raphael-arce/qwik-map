import { QwikTouchEvent } from '@builder.io/qwik';
import { MapStore } from '../../store/map';
import { getTouchPosition } from '../../dom';
import { add, subtract } from '../../geometry';
import { SphericalMercator } from '../../projection';

export function onTouchStart(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  if (store.interaction.panBegin) {
    return;
  }

  store.interaction.panBegin = getTouchPosition(event);
}

export function onTouchMove(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.panBegin) {
    return;
  }

  const currentTouchPosition = getTouchPosition(event);

  const panDifference = subtract(store.interaction.panBegin, currentTouchPosition);
  const newRelativeCenter = add(store.computedCenter, panDifference);
  const newWorldCenter = add(store.pixelOrigin, newRelativeCenter);

  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const newCenterLatLng = SphericalMercator.unproject(newWorldCenter, worldSurfaceAtZoomLevel);

  store.lat = newCenterLatLng.lat;
  store.lng = newCenterLatLng.lng;
}

export function onTouchEnd(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.panBegin) {
    return;
  }

  const panEnd = getTouchPosition(event);

  const panDifference = subtract(store.interaction.panBegin, panEnd);

  store.interaction.panBegin = undefined;
  store.pixelOrigin = add(store.pixelOrigin, panDifference);
}
