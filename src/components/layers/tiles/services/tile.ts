import { MapStore } from '../../../../store/map';

function getTileUrl({ tx, ty, store }: { tx: number; ty: number; store: MapStore }) {
  return store.tileProvider.url.replace('{z}', `${store.zoom}`).replace('{x}', `${tx}`).replace('{y}', `${ty}`);
}

function getTileStyle({ tx, x, ty, y }: { tx: number; x: number; ty: number; y: number }) {
  // prettier-ignore
  return `position:absolute;left:${tx * 256 - x}px;top:${ty * 256 - y}px;user-drag:none;user-select:none;-moz-user-select:none;-webkit-user-drag:none;-webkit-user-select:none;-ms-user-select:none;z-index:-100;`;
}

export function getTiles(store: MapStore) {
  // prettier-ignore
  const x = (256 * (1 << store.zoom) * (store.lng / 360 + 0.5) - store.computedWidth / 2) | 0;
  // prettier-ignore
  const y = ((256 * (1 << store.zoom) * (1 - Math.log(Math.tan(Math.PI * (0.25 + store.lat / 360))) / Math.PI)) / 2 - store.computedHeight / 2) | 0;

  const tiles = [];

  for (let ty = (y / 256) | 0; ty * 256 < y + store.computedHeight; ty++) {
    for (let tx = (x / 256) | 0; tx * 256 < x + store.computedWidth; tx++) {
      tiles.push([getTileUrl({ tx, ty, store }), getTileStyle({ tx, x, ty, y })]);
    }
  }

  return tiles;
}
