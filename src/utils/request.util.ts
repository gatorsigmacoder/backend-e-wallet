import { ZodError } from "zod";

export function getZodError(zodError: ZodError) {
  const errors = zodError.issues.map((issue) => {
    return {
      path: issue.path,
      message: issue.message,
    };
  });

  return errors;
}
