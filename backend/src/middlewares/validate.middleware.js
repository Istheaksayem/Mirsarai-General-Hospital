import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate request data using Zod schemas
 * 
 * @param {Object} schema - Zod schema object with optional body, query, params
 * @returns {Function} Express middleware
 * 
 * @example
 * const schema = z.object({
 *   body: z.object({ name: z.string() }),
 *   query: z.object({ page: z.string().optional() }),
 *   params: z.object({ id: z.string() })
 * });
 * router.post('/users', validate(schema), controller);
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validationData = {};

      if (schema.body) validationData.body = req.body;
      if (schema.query) validationData.query = req.query;
      if (schema.params) validationData.params = req.params;

      const parsed = schema.parse(validationData);

      // Replace request data with validated data
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      // Zod validation error
      if (error.name === 'ZodError') {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(
          new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', true, {
            errors,
          })
        );
      }

      next(error);
    }
  };
};

export default validate;
