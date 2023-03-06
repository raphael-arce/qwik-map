import { Point } from './Point';

export type Interaction = {
  isPanning: boolean;
  panBegin?: Point | undefined;
  mousePos?: Point | undefined;
};
