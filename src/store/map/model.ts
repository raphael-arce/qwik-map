import { LatLng, TileProvider } from "../../models";
import { Interaction, Point } from "../../models";

export type MapStore = {
  width: number;
  height: number;
  zoom: number;
  lat: number;
  lng: number;
  center: LatLng;
  tileProvider: TileProvider;
  interaction: Interaction;
  pixelOrigin: Point;
};
