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
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace request data with validated data
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;

      next();
    } catch (error) {
      // Zod validation error
      if (error.name === 'ZodError') {
        const issues = error.issues || error.errors || [];
        const errors = issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const apiErr = new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed');
        apiErr.errors = errors;
        return next(apiErr);
      }

      next(error);
    }
  };
};

export default validate;
