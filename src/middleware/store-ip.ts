import { Response, NextFunction } from 'express';

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (req: any, res: Response, next: NextFunction) => {
    if (req.ip) {
      req.feathers.ip = req.ip;
    }
    next();
  };
};
