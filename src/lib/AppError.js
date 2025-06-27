export class AppError extends Error {
  constructor(msg, opts = {}) {
    super(msg);
    this.userMessage = opts.userMessage || msg;
    this.status = opts.status || 500;
    this.showDetails = opts.showDetails ?? true;
  }
}
