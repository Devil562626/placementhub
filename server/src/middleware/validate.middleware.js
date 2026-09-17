import { fail } from '../utils/ApiResponse.js';

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!parsed.success) {
    return fail(res, 'Validation failed', 422,
      parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })));
  }
  req.body = parsed.data.body;
  next();
};
