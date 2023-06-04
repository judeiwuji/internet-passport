import { NextFunction, Request, Response } from 'express';

export default function Error401Handler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.code === 'E401') {
    res.render('error401', {
      page: {
        title: 'Error 401',
        description: 'This section is for logged in users',
      },
    });
  }
}
