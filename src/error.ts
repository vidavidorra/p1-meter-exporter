class DetailedError extends Error {
  readonly rollbarContext?: Record<string, unknown>;
  readonly reportToRollbar: boolean;

  constructor(
    message: string,
    details?: Record<string, unknown>,
    report = true,
    error?: Error,
  ) {
    super(message);
    this.name = 'DetailedError';
    this.rollbarContext = details;
    this.reportToRollbar = report;
    if (error !== undefined) {
      this.cause = error.cause ?? this.cause;
      this.stack = error.stack ?? this.stack;
    }
  }
}

export {DetailedError};
