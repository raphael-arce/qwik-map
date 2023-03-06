import { TileProvider } from '../../models';
import { Interaction, Point } from '../../models';

export type MapStore = {
  width: string;
  computedWidth: number;
  height: string;
  computedHeight: number;
  zoom: number;
  lat: number;
  lng: number;
  tileProvider: TileProvider;
  interaction: Interaction;
  pixelOrigin: Point;
};
