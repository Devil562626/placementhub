export const ok = (res, data = null, message = 'Success', code = 200) =>
  res.status(code).json({ success: true, message, data });

export const fail = (res, message = 'Error', code = 500, errors = []) =>
  res.status(code).json({ success: false, message, errors });
