import {
  component$,
  useContextProvider,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { MapStore, QwikMapContext } from "../store/map";
import { TilesLayer } from "./layers/tiles";
import { InteractionsLayer } from "./layers/interactions";
import { getPixelOrigin } from "../utils";

export const QwikMap = component$(() => {
  const initialStore = {
    width: 800,
    height: 400,
    zoom: 15,
    lat: 52.5250701,
    lng: 13.3977592,
    center: { lat: 52.5250701, lng: 13.3977592 },
    pixelOrigin: { x: 0, y: 0 },
    tileProvider: {
      tileSize: 256,
      name: "OSM",
      maxZoom: 19,
      minZoom: 0,
      url: "https://tile.osm.org/{z}/{x}/{y}.png",
    },
    interaction: {
      isPanning: false,
    },
  };

  const store = useStore<MapStore>({
    ...initialStore,
    pixelOrigin: getPixelOrigin(initialStore),
  });

  useTask$(({ track }) => {
    track(() => store.zoom);
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
