/**
 * Wrapper function to catch async errors
 * Eliminates the need for try-catch blocks in controllers
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 * 
 * @example
 * export const getUsers = catchAsync(async (req, res) => {
 *   const users = await UserService.getAllUsers();
 *   sendSuccess(res, 200, users);
 * });
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
