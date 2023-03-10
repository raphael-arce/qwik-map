import { component$, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { MapStore, QwikMapContext } from '../store/map';
import { TilesLayer } from './layers/tiles';
import { InteractionsLayer } from './layers/interactions';
import { getPixelOrigin, parseCssLength } from '../utils';

export type QwikMap = {
  width: string;
  height: string;
  zoom: number;
  lat: number;
  lng: number;
};

export const QwikMap = component$((props: QwikMap) => {
  const initialStore = {
    width: props.width,
    computedWidth: parseCssLength(props.width),
    height: props.height,
    computedHeight: parseCssLength(props.height),
    computedCenter: { x: parseCssLength(props.width) / 2, y: parseCssLength(props.height) / 2 },
    zoom: props.zoom,
    lat: props.lat,
    lng: props.lng,
    pixelOrigin: { x: 0, y: 0 },
    tileProvider: {
      tileSize: 256,
      name: 'OSM',
      maxZoom: 19,
      minZoom: 0,
      url: 'https://tile.osm.org/{z}/{x}/{y}.png',
    },
    interaction: {
      panBegin: undefined,
    },
  };

  const store = useStore<MapStore>({
    ...initialStore,
    pixelOrigin: getPixelOrigin(initialStore),
  });

  useTask$(({ track }) => {
    track(() => store.zoom);
    track(() => store.computedWidth);
    track(() => store.computedHeight);
    store.pixelOrigin = getPixelOrigin(store);
  });

  useContextProvider(QwikMapContext, store);

  return (
    <>
      <InteractionsLayer>
        <TilesLayer />
      </InteractionsLayer>
    </>
  );
});
