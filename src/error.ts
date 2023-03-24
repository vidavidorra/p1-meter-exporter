class P1MeterError extends Error {
  readonly details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'P1MeterError';
    this.details = details;
  }
}

export default P1MeterError;
