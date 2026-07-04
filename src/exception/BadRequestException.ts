import HttpException from "@/types/httpException";

export default class BadRequestException<T> extends HttpException {
  constructor(status: number, message = "Bad Request", error: T | null = null) {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = 400;
    this.error = error;
    this.status = status;
  }
}
