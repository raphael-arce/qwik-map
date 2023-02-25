import { $, QwikWheelEvent } from "@builder.io/qwik";
import { MapStore } from "../../store/map";

export const lastCalls = {
  lastZoomIn: 0,
  lastZoomOut: 0,
};

export const delay = 50;

export function shouldZoomIn(
  event: QwikWheelEvent<HTMLDivElement>,
  store: MapStore,
): boolean {
  const isZoomIn = event.deltaY < 0;

  if (!isZoomIn) {
    return false;
  }

  const isAllowed = store.zoom < store.tileProvider.maxZoom;
  const isDebounced = Date.now() > lastCalls.lastZoomIn + delay;

  return isAllowed && isDebounced;
}

export function shouldZoomOut(
  event: QwikWheelEvent<HTMLDivElement>,
  store: MapStore,
): boolean {
  const isZoomOut = event.deltaY > 0;

  if (!isZoomOut) {
    return false;
  }

  const isAllowed = store.zoom > store.tileProvider.minZoom;
  const isDebounced = Date.now() > lastCalls.lastZoomOut + delay;

  return isAllowed && isDebounced;
}

export const onWheel = $(
  (event: QwikWheelEvent<HTMLDivElement>, store: MapStore) => {
    if (shouldZoomIn(event, store)) {
      store.zoom = store.zoom + 1;
      lastCalls.lastZoomIn = Date.now();
      return;
    }

    if (shouldZoomOut(event, store)) {
      store.zoom = store.zoom - 1;
      lastCalls.lastZoomOut = Date.now();
      return;
    }
  },
);
