import { LatLng, Point } from '../models';

export const SphericalMercator = {
  MAX_LATITUDE: 85.0511287798,

  getCappedLat(lat: number) {
    return Math.max(Math.min(this.MAX_LATITUDE, lat), -this.MAX_LATITUDE);
  },

  /**
   *  Converts a geo-coordinate into a point
   *
   *                   longitude
   * x = worldSize * (----------- + 0.5)
   *                     360
   *
   *                                                 latitude
   *                        log( tan( PI * ( 0,25 + ---------- ) ) )
   *                                                   360                 1
   * y = worldSize * ( 1 - ----------------------------------------- ) *  ---
   *                                         PI                           2
   *
   *
   */
  project({ lat, lng }: LatLng, worldSurface: number): Point {
    const cappedLat = this.getCappedLat(lat);

    return {
      x: worldSurface * (lng / 360 + 0.5),
      y: (worldSurface * (1 - Math.log(Math.tan(Math.PI * (0.25 + cappedLat / 360))) / Math.PI)) / 2,
    };
  },

  /**
   * Converts a point into a geo-coordinate at given world surface
   *
   *                     x
   * longitude = ((-------------) - 0,5) * 360
   *                 worldSize
   *
   *                                               2y
   *                              PI * ( 1 - ------------ )
   *                     atan ( e^              worldSize   )
   * latitude = 360 * ( --------------------------------------  -  0,25 )
   *                                    PI
   */
  unproject({ x, y }: Point, worldSurface: number): LatLng {
    const lat = 360 * (Math.atan(Math.exp(Math.PI * (1 - (2 * y) / worldSurface))) / Math.PI - 0.25);
    const cappedLat = this.getCappedLat(lat);

    return {
      lng: 360 * (x / worldSurface - 0.5),
      lat: cappedLat,
    };
  },
};
