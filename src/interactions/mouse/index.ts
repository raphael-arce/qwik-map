import { QwikMouseEvent } from '@builder.io/qwik';
import { MapStore } from '../../store/map';
import { SphericalMercator } from '../../geo';
import { getMousePosition } from '../../dom/mouse';

export function onMouseDown(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (store.interaction.isPanning || event.button !== 0) {
    return;
  }

  const { x, y } = getMousePosition(event);

  store.interaction.isPanning = true;
  store.interaction.panBegin = { x, y };
}

export function onMouseUp(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.isPanning || event.button !== 0) {
    return;
  }

  const target = event.target;

  const rect = (target as Element).getBoundingClientRect();

  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top);

  const diffX = store.interaction.panBegin!.x - x;
  const diffY = store.interaction.panBegin!.y - y;

  store.interaction.isPanning = false;
  store.pixelOrigin = {
    x: store.pixelOrigin.x + diffX,
    y: store.pixelOrigin.y + diffY,
  };
}

export function onMouseMove(event: QwikMouseEvent<HTMLDivElement>, store: MapStore) {
  if (!store.interaction.isPanning) {
    return;
  }

  const { x, y } = getMousePosition(event);

  const diffX = store.interaction.panBegin!.x - x;
  const diffY = store.interaction.panBegin!.y - y;

  const newCenterPoint = {
    x: store.pixelOrigin.x + diffX + store.computedWidth / 2,
    y: store.pixelOrigin.y + diffY + store.computedHeight / 2,
  };

  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const newCenterLatLng = SphericalMercator.unproject(newCenterPoint, worldSurfaceAtZoomLevel);

  store.lat = newCenterLatLng.lat;
  store.lng = newCenterLatLng.lng;
}
