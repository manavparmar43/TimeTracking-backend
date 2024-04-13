export const responseFile = (_req: any, res: any, _next: any) => {
  if (_req.fileValidationError) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(JSON.stringify({ status: 0, message: _req.fileValidationError }));
  } else {
    if (_req.file) {
      _req.feathers.file = _req.file;
    }
    if (_req.files) {
      _req.feathers.files = _req.files;
    }
    _next();
  }
};
