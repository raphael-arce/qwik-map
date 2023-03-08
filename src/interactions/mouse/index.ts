import { QwikMouseEvent } from '@builder.io/qwik';
import { MapStore } from '../../store/map';
import { SphericalMercator } from '../../projection';
import { getMousePosition } from '../../dom';
import { add, subtract } from '../../geometry';

export function onMouseDown(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (store.interaction.panBegin || event.button !== 0) {
    return;
  }

  store.interaction.panBegin = getMousePosition(event);
}

export function onMouseUp(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.panBegin || event.button !== 0) {
    return;
  }

  const panEnd = getMousePosition(event);

  const panDifference = subtract(store.interaction.panBegin, panEnd);

  store.interaction.panBegin = undefined;
  store.pixelOrigin = add(store.pixelOrigin, panDifference);
}

export function onMouseMove(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.panBegin) {
    return;
  }

  const currentMousePosition = getMousePosition(event);

  const panDifference = subtract(store.interaction.panBegin, currentMousePosition);
  const newRelativeCenter = add(store.computedCenter, panDifference);
  const newWorldCenter = add(store.pixelOrigin, newRelativeCenter);

  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const newCenterLatLng = SphericalMercator.unproject(newWorldCenter, worldSurfaceAtZoomLevel);

  store.lat = newCenterLatLng.lat;
  store.lng = newCenterLatLng.lng;
}
