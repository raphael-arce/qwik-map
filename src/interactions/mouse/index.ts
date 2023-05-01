import { QwikMouseEvent } from '@builder.io/qwik';
import { MapStore } from '../../store';
import { getMousePosition } from '../../dom';
import { add, subtract } from '../../geometry';
import { getNewZoomInCenter } from '../../utils/zoom';
import { Point } from '../../models';
import { getNewMapCenter } from '../../utils/pan';

let panBegin: Point | undefined = undefined;

function shouldZoomIn(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  const isAllowed = store.zoom < store.tileProvider.maxZoom;

  if (!isAllowed) {
    return false;
  }

  return true;
}

function getNewDoubleClickZoomInCenter(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  const mousePosition = getMousePosition(event);

  return getNewZoomInCenter(mousePosition, store);
}

export function onMouseDown(event: QwikMouseEvent<HTMLDivElement>) {
  if (panBegin || event.button !== 0) {
    return;
  }

  panBegin = getMousePosition(event);
}

export function onMouseMove(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!panBegin) {
    return;
  }

  const currentMousePosition = getMousePosition(event);

  const panDifference = subtract(panBegin, currentMousePosition);

  const newCenterLatLng = getNewMapCenter(panDifference, store);

  store.lat = newCenterLatLng.lat;
  store.lng = newCenterLatLng.lng;
}

export function onMouseUp(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!panBegin || event.button !== 0) {
    return;
  }

  const panEnd = getMousePosition(event);

  const panDifference = subtract(panBegin, panEnd);

  panBegin = undefined;
  store.pixelOrigin = add(store.pixelOrigin, panDifference);
}

export function onDoubleClick(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!shouldZoomIn(event, store)) {
    return;
  }

  const { lat, lng } = getNewDoubleClickZoomInCenter(event, store);

  store.lat = lat;
  store.lng = lng;

  store.zoom = store.zoom + 1;
}
