import { $, QwikWheelEvent } from '@builder.io/qwik';
import { MapStore } from '../../store/map';
import { getMousePosition } from '../../dom/mouse';
import { SphericalMercator } from '../../projection';
import { add, divideScalar, subtract } from '../../geometry';

export const lastCalls = {
  lastZoomIn: 0,
  lastZoomOut: 0,
};

export const debounceLimit = 150;

export function shouldZoomIn(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): boolean {
  const isZoomIn = event.deltaY < 0;

  if (!isZoomIn) {
    return false;
  }

  const isAllowed = store.zoom < store.tileProvider.maxZoom;

  const timeDelta = Date.now() - lastCalls.lastZoomIn;
  const isDebounced = timeDelta > debounceLimit;

  return isAllowed && isDebounced;
}

export function getNewZoomInCenter(event: QwikWheelEvent<HTMLDivElement>, store: MapStore) {
  const mousePosition = getMousePosition(event);

  const mouseWorldPosition = add(store.pixelOrigin, mousePosition);
  const oldCenter = add(store.pixelOrigin, store.computedCenter);
  const newCenter = divideScalar(add(mouseWorldPosition, oldCenter), 2);

  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  return SphericalMercator.unproject(newCenter, worldSurfaceAtZoomLevel);
}

export function shouldZoomOut(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): boolean {
  const isZoomOut = event.deltaY > 0;

  if (!isZoomOut) {
    return false;
  }

  const isAllowed = store.zoom > store.tileProvider.minZoom;

  const timeDelta = Date.now() - lastCalls.lastZoomOut;
  const isDebounced = timeDelta > debounceLimit;

  return isAllowed && isDebounced;
}

export function getNewZoomOutCenter(event: QwikWheelEvent<HTMLDivElement>, store: MapStore) {
  const mousePosition = getMousePosition(event);

  const mouseWorldPosition = add(store.pixelOrigin, mousePosition);
  const oldCenter = add(store.pixelOrigin, store.computedCenter);
  const newCenter = subtract(oldCenter, subtract(mouseWorldPosition, oldCenter));

  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  return SphericalMercator.unproject(newCenter, worldSurfaceAtZoomLevel);
}

export const onWheel = $((event: QwikWheelEvent<HTMLDivElement>, store: MapStore) => {
  if (shouldZoomIn(event, store)) {
    const { lat, lng } = getNewZoomInCenter(event, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom = store.zoom + 1;

    lastCalls.lastZoomIn = Date.now();
    return;
  }

  if (shouldZoomOut(event, store)) {
    const { lat, lng } = getNewZoomOutCenter(event, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom = store.zoom - 1;

    lastCalls.lastZoomOut = Date.now();
    return;
  }
});
