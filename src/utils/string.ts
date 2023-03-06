export function parseCssLength(value: string): number {
  if (value.includes('px')) {
    return Number(value.replace('px', ''));
  }

  return 0;
}
