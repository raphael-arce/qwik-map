import { Point } from '../models';

export function round(point: Point): Point {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}

export function add(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}

export function subtract(p1: Point, p2: Point): Point {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
}

export function divideScalar(point: Point, scalar: number): Point {
  return {
    x: point.x / scalar,
    y: point.y / scalar,
  };
}

export function distance(p1: Point, p2: Point): number {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.sqrt(a * a + b * b);
}

export function midpoint(p1: Point, p2: Point): Point {
  return divideScalar(add(p1, p2), 2);
}
