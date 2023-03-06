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

export function getNewZoomOutCenter(
  event: QwikWheelEvent<HTMLDivElement>,
  store: MapStore,
) {

  const mousePosition = getMousePosition(event);

  const mouseWorldPosition = {
    x: mousePosition.x + store.pixelOrigin.x,
    y: mousePosition.y + store.pixelOrigin.y,
  };

  const worldSurfaceAtZoomLevel =
    Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const centerPointCoordinates = SphericalMercator.project({
    lat: store.lat,
    lng: store.lng
  }, worldSurfaceAtZoomLevel);

  const newCenterPointCoordinates = {
    x: centerPointCoordinates.x - (mouseWorldPosition.x - centerPointCoordinates.x),
    y: centerPointCoordinates.y - (mouseWorldPosition.y - centerPointCoordinates.y),
  }

  return SphericalMercator.unproject(newCenterPointCoordinates, worldSurfaceAtZoomLevel);
}

export function getNewZoomInCenter(
  event: QwikWheelEvent<HTMLDivElement>,
  store: MapStore,
) {

  const mousePosition = getMousePosition(event);

  const mouseWorldPosition = {
    x: mousePosition.x + store.pixelOrigin.x,
    y: mousePosition.y + store.pixelOrigin.y,
  };

  const worldSurfaceAtZoomLevel =
    Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const centerPointCoordinates = {
    x: store.pixelOrigin.x + store.computedWidth / 2,
    y: store.pixelOrigin.y + store.computedHeight / 2,
  }

  const newCenterPointCoordinates = {
    x: (mouseWorldPosition.x + centerPointCoordinates.x) / 2,
    y: (mouseWorldPosition.y + centerPointCoordinates.y) / 2,
  }

  return SphericalMercator.unproject(newCenterPointCoordinates, worldSurfaceAtZoomLevel);
}

export const onWheel = $(
  (event: QwikWheelEvent<HTMLDivElement>, store: MapStore) => {
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
  },
);
