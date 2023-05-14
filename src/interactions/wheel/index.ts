import { QwikWheelEvent } from '@builder.io/qwik';
import { MapStore } from '../../store';
import { getMousePosition } from '../../dom';
import { getNewZoomInCenter, getNewZoomOutCenter } from '../../utils';
import { LatLng } from '../../models';

export const lastCalls = {
  lastZoomIn: 0,
  lastZoomOut: 0,
};

export const debounceLimit = 150;

function shouldZoomIn(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): boolean {
  const isAllowed = store.zoom < store.tileProvider.maxZoom;

  if (!isAllowed) {
    return false;
  }

  const timeDelta = Date.now() - lastCalls.lastZoomIn;
  const isDebounced = timeDelta > debounceLimit;

  if (!isDebounced) {
    return false;
  }

  const isZoomIn = event.deltaY < 0;

  if (!isZoomIn) {
    return false;
  }

  return true;
}

function getNewWheelZoomInCenter(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): LatLng {
  const mousePosition = getMousePosition(event);

  return getNewZoomInCenter(mousePosition, store);
}

export function shouldZoomOut(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): boolean {
  const isAllowed = store.zoom > store.tileProvider.minZoom;

  if (!isAllowed) {
    return false;
  }

  const timeDelta = Date.now() - lastCalls.lastZoomIn;
  const isDebounced = timeDelta > debounceLimit;

  if (!isDebounced) {
    return false;
  }

  const isZoomOut = event.deltaY > 0;

  if (!isZoomOut) {
    return false;
  }

  return true;
}

function getNewWheelZoomOutCenter(event: QwikWheelEvent<HTMLDivElement>, store: MapStore): LatLng {
  const mousePosition = getMousePosition(event);

  return getNewZoomOutCenter(mousePosition, store);
}

export function onWheel(event: QwikWheelEvent<HTMLDivElement>, store: MapStore) {
  if (shouldZoomIn(event, store)) {
    const { lat, lng } = getNewWheelZoomInCenter(event, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom = store.zoom + 1;

    lastCalls.lastZoomIn = Date.now();
    return;
  }

  if (shouldZoomOut(event, store)) {
    const { lat, lng } = getNewWheelZoomOutCenter(event, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom = store.zoom - 1;

    lastCalls.lastZoomOut = Date.now();
    return;
  }
}
