import Validator, {
  ValidationError,
  ValidationSchema,
} from "fastest-validator";
import BadRequestException from "@/exception/BadRequestException";

const v = new Validator();

export default <T>(schema: ValidationSchema<T>, data: T) => {
  const check = v.compile(schema);
  const result = check(data || {});
  if (result !== true) {
    throw new BadRequestException(
      102,
      "Parameter tidak sesuai format",
      result as ValidationError[],
    );
  }
  return data;
};
