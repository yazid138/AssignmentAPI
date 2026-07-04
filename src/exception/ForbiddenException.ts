import HttpException from "@/types/httpException";

export default class ForbiddenException extends HttpException {
  constructor(status: number, message = "Forbidden") {
    super(message);
    this.name = "ForbiddenException";
    this.statusCode = 403;
    this.status = status;
  }
}
