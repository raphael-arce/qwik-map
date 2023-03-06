import { QwikMouseEvent } from '@builder.io/qwik';
import { Point } from '../models';

export function getMousePosition(event: QwikMouseEvent<HTMLDivElement>): Point {
  const target = event.target;

  const rect = (target as Element).getBoundingClientRect();

  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top);

  return { x, y };
}
