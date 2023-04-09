function round(value: number, decimalPlaces: number): number {
  const factor = 10 ** Math.max(0, decimalPlaces);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export default round;
