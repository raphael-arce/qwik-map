import { MapStore } from '../../../../store';
import { Signal } from '@builder.io/qwik';

export function addSizeObserver(mapRef: Signal<Element | undefined>, store: MapStore) {
  if (!mapRef.value) {
    return;
  }

  new ResizeObserver(([mapElement]) => {
    const newWidth = Math.round(mapElement.contentRect.width);
    if (store.computedWidth !== newWidth) {
      store.computedWidth = newWidth;
      store.computedCenter = {
        x: newWidth / 2,
        y: store.computedCenter.y,
      };
    }

    const newHeight = Math.round(mapElement.contentRect.height);
    if (store.computedHeight !== newHeight) {
      store.computedHeight = newHeight;
      store.computedCenter = {
        x: store.computedCenter.x,
        y: newHeight / 2,
      };
    }
  }).observe(mapRef.value);
}
