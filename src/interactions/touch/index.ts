import { QwikTouchEvent } from '@builder.io/qwik';
import { MapStore } from '../../store';
import { getTouchPosition } from '../../dom';
import { add, subtract } from '../../geometry';
import { distance, midpoint } from '../../geometry/operations';
import { Point } from '../../models';
import { getNewMapCenter } from '../../utils/pan';
import { getNewZoomInCenter, getNewZoomOutCenter } from '../../utils/zoom';

const touches: Touch[] = [];

function handleTouchPan(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  const previousTouchPosition = getTouchPosition(touches[0]);
  const currentTouchPosition = getTouchPosition(event.targetTouches[0]);

  const panDifference = subtract(previousTouchPosition, currentTouchPosition);

  const newCenterLatLng = getNewMapCenter(panDifference, store);

  store.lat = newCenterLatLng.lat;
  store.lng = newCenterLatLng.lng;

  store.pixelOrigin = add(store.pixelOrigin, panDifference);
}

function getNewPinchZoomInCenter(p0: Point, p1: Point, store: MapStore) {
  const pinchMidpoint = midpoint(p0, p1);

  return getNewZoomInCenter(pinchMidpoint, store);
}

function getNewPinchZoomOutCenter(p0: Point, p1: Point, store: MapStore) {
  const pinchMidpoint = midpoint(p0, p1);

  return getNewZoomOutCenter(pinchMidpoint, store);
}

function shouldZoomIn({
  currentDistance,
  previousDistance,
  store,
}: {
  currentDistance: number;
  previousDistance: number;
  store: MapStore;
}): boolean {
  const isZoomIn = currentDistance > previousDistance;

  if (!isZoomIn) {
    return false;
  }

  const isAllowed = store.zoom < store.tileProvider.maxZoom;

  if (!isAllowed) {
    return false;
  }

  return true;
}

function shouldZoomOut({
  currentDistance,
  previousDistance,
  store,
}: {
  currentDistance: number;
  previousDistance: number;
  store: MapStore;
}): boolean {
  const isZoomOut = currentDistance < previousDistance;

  if (!isZoomOut) {
    return false;
  }

  const isAllowed = store.zoom > store.tileProvider.minZoom;

  if (!isAllowed) {
    return false;
  }

  return true;
}

function handlePinchZoom(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  const previousTouchPosition0 = getTouchPosition(touches[0]);
  const currentTouchPosition0 = getTouchPosition(event.targetTouches[0]);

  const previousTouchPosition1 = getTouchPosition(touches[1]);
  const currentTouchPosition1 = getTouchPosition(event.targetTouches[1]);

  const previousDistance = distance(previousTouchPosition0, previousTouchPosition1);
  const currentDistance = distance(currentTouchPosition0, currentTouchPosition1);
  const diff = Math.abs(previousDistance - currentDistance);

  const PINCH_THRESHOLD = (event.target as Element).clientWidth / 10;

  if (diff < PINCH_THRESHOLD) {
    return;
  }

  if (currentDistance === previousDistance) {
    return;
  }

  if (shouldZoomIn({ previousDistance, currentDistance, store })) {
    const { lat, lng } = getNewPinchZoomInCenter(currentTouchPosition0, currentTouchPosition1, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom += 1;

    return;
  }

  if (shouldZoomOut({ previousDistance, currentDistance, store })) {
    const { lat, lng } = getNewPinchZoomOutCenter(currentTouchPosition0, currentTouchPosition1, store);

    store.lat = lat;
    store.lng = lng;

    store.zoom -= 1;

    return;
  }
}

export function onTouchStart(event: QwikTouchEvent<HTMLDivElement>) {
  for (let i = 0; i < event.targetTouches.length; i++) {
    touches.splice(i, 1, event.targetTouches[i]);
  }
}

export function onTouchMove(event: QwikTouchEvent<HTMLDivElement>, store: MapStore) {
  if (touches.length > 3) {
    return;
  }

  if (touches.length === 2) {
    handlePinchZoom(event, store);

    for (let i = 0; i < touches.length; i++) {
      touches.splice(i, 1, event.targetTouches[i]);
    }

    return;
  }

  if (touches.length === 1) {
    handleTouchPan(event, store);

    for (let i = 0; i < touches.length; i++) {
      touches.splice(i, 1, event.targetTouches[i]);
    }

    return;
  }
}

export function onTouchEnd(event: QwikTouchEvent<HTMLDivElement>) {
  for (let i = 0; i < touches.length; i++) {
    const touch = event.targetTouches[i];

    if (!touch) {
      touches.splice(i, 1);
      continue;
    }

    touches.splice(i, 1, touch);
  }
}
