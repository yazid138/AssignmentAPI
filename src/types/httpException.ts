export default class HttpException extends Error {
  public status: number;
  public statusCode: number;
  public error: any;

  constructor(message: string) {
    super(message);
    this.status = 110;
    this.statusCode = 500;
    this.error = null;
  }
}
