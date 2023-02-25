import { component$, useContext } from "@builder.io/qwik";
import { QwikMapContext, MapStore } from "../../../store/map";

export const TilesLayer = component$(() => {
  const store: MapStore = useContext(QwikMapContext);

  // prettier-ignore
  const x = (256 * (1 << store.zoom) * (store.lng / 360 + 0.5) - store.width / 2) | 0;
  // prettier-ignore
  const y = ((256 * (1 << store.zoom) * (1 - Math.log(Math.tan(Math.PI * (0.25 + store.lat / 360))) / Math.PI)) / 2 - store.height / 2) | 0;

  const tiles = [];

  for (let ty = (y / 256) | 0; ty * 256 < y + store.height; ty++) {
    for (let tx = (x / 256) | 0; tx * 256 < x + store.width; tx++) {
      tiles.push([
        `https://tile.osm.org/${store.zoom}/${tx}/${ty}.png`,
        `position:absolute;left:${tx * 256 - x}px;top:${
          ty * 256 - y
        }px;user-drag:none;user-select:none;-moz-user-select:none;-webkit-user-drag:none;-webkit-user-select:none;-ms-user-select:none;z-index:-100;`,
      ]);
    }
  }

  return (
    <div
      style={`width:${store.width}px;height:${store.height}px;position:relative;overflow:hidden;z-index:-100;`}
    >
      {tiles.map(([src, style]) => (
        <img src={src} key={src} style={style} draggable={false} alt='tile displaying a part of a map' />
      ))}
      <div style="position:absolute;bottom:0;right:0;font:11px sans-serif;background:#fffa;padding:1px 5px">
        &copy; <a href="https://osm.org/copyright">OpenStreetMap</a>{" "}
        contributors
      </div>
    </div>
  );
});
