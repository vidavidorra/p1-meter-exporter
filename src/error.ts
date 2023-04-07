class DetailedError extends Error {
  readonly rollbarContext?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'DetailedError';
    this.rollbarContext = details;
  }
}

export {DetailedError};
