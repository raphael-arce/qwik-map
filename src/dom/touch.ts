import { Point } from '../models';

export function getTouchPosition(touch: Touch): Point {
  const rect = (touch.target as Element).getBoundingClientRect();

  const x = Math.round(touch.clientX - rect.left);
  const y = Math.round(touch.clientY - rect.top);

  return { x, y };
}
