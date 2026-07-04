import HttpException from "@/types/httpException";

export default class UnauthorizedException extends HttpException {
  constructor(status: number, message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
    this.statusCode = 401;
    this.status = status;
  }
}
