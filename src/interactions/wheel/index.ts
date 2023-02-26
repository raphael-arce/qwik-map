import { $, QwikWheelEvent } from "@builder.io/qwik";
import { MapStore } from "../../store/map";
import { getMousePosition } from "../../dom/mouse";
import { SphericalMercator } from "../../geo";

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

export function getOffset(
  event: QwikWheelEvent<HTMLDivElement>,
  store: MapStore,
) {
  const worldSurfaceAtZoomLevel =
    Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const mousePosition = getMousePosition(event);

  const mouseWorldPosition = {
    x: mousePosition.x + store.pixelOrigin.x,
    y: mousePosition.y + store.pixelOrigin.y,
  };

  const mouseGeoCoordinate = SphericalMercator.unproject(
    mouseWorldPosition,
    worldSurfaceAtZoomLevel,
  );

  return {
    lat: mouseGeoCoordinate.lat - store.lat,
    lng: mouseGeoCoordinate.lng - store.lng,
  }
}

export const onWheel = $(
  (event: QwikWheelEvent<HTMLDivElement>, store: MapStore) => {
    if (shouldZoomIn(event, store)) {
      const offset = getOffset(event, store);

      store.zoom = store.zoom + 1;
      store.lat = store.lat + offset.lat;
      store.lng = store.lng + offset.lng;

      lastCalls.lastZoomIn = Date.now();
      return;
    }

    if (shouldZoomOut(event, store)) {
      const offset = getOffset(event, store);

      store.zoom = store.zoom - 1;
      store.lat = store.lat - offset.lat;
      store.lng = store.lng - offset.lng;

      lastCalls.lastZoomOut = Date.now();
      return;
    }
  },
);
