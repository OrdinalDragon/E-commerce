import { ZodError } from 'zod';

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors.map((e) => e.message).join(', ');
      res.status(400);
      return next(new Error(message));
    }
    next(error);
  }
};

export default validate;
