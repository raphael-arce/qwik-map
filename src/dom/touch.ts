import { QwikTouchEvent } from '@builder.io/qwik';
import { Point } from '../models';

export function getTouchPosition(event: QwikTouchEvent<HTMLDivElement>): Point {
  const target = event.target;

  const rect = (target as Element).getBoundingClientRect();

  const x = Math.round(event.changedTouches[0].clientX - rect.left);
  const y = Math.round(event.changedTouches[0].clientY - rect.top);

  return { x, y };
}
