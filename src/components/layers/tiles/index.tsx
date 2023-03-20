import { component$, Slot, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { QwikMapContext, MapStore } from '../../../store';
import { addSizeObserver, getTiles } from './services';

const TilesLayer = component$(() => {
  const store: MapStore = useContext(QwikMapContext);

  const mapRef = useSignal<Element>();

  useVisibleTask$(() => {
    addSizeObserver(mapRef, store);
  });

  const tiles = getTiles(store);

  return (
    <div
      ref={mapRef}
      style={`width:${store.width};height:${store.height};position:relative;overflow:hidden;z-index:-100;`}
    >
      <Slot />
      {tiles.map(([tileUrl, tileStyle]) => (
        <img
          src={tileUrl}
          key={tileUrl}
          style={tileStyle}
          draggable={false}
          alt="tile displaying a part of a map"
        />
      ))}
      <div style="position:absolute;bottom:0;right:0;font:11px sans-serif;background:#fffa;padding:1px 5px">
        &copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors
      </div>

    </div>
  );
});

export { TilesLayer, addSizeObserver, getTiles };
