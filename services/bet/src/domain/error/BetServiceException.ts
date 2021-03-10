export default class BetServiceError extends Error {
  detail?: Error | Record<string, unknown> | undefined;

  constructor(message: string, detail?: Error | Record<string, unknown> | undefined) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = 'BetServiceError';
    this.detail = detail;
  }

  toJSON() {
    return {
      message: this.message,
      ...(this.detail && { detail: this.detail }),
    };
  }
}
