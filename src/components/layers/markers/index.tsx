import { component$, useContext } from '@builder.io/qwik';
import { MapStore, QwikMapContext } from '../../../store';
import { round, subtract } from '../../../geometry';
import { SphericalMercator } from '../../../projection';
import { getPixelOrigin } from '../../../utils';

export type MarkerProps = {
  lat: number;
  lng: number;
};

export function getMarkerPosition(store: MapStore, props: MarkerProps) {
  const worldSurfaceAtZoomLevel = Math.pow(2, store.zoom) * store.tileProvider.tileSize;

  const projectedPosition = round(
    SphericalMercator.project({ lat: props.lat, lng: props.lng }, worldSurfaceAtZoomLevel),
  );

  return subtract(projectedPosition, getPixelOrigin(store));
}

export const Marker = component$((props: MarkerProps) => {
  const store: MapStore = useContext(QwikMapContext);

  const position = getMarkerPosition(store, props);

  return (
    <div
      style={{
        background: '#f00',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        position: 'relative',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
});
