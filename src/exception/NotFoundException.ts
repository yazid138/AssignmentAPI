import HttpException from "@/types/httpException";

export default class NotFoundException extends HttpException {
  constructor(status: number, message = "Not Found") {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = 404;
    this.status = status;
  }
}
