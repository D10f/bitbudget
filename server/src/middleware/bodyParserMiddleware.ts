import { json, raw } from 'body-parser';
import { RequestHandler } from 'express';

export const bodyParserMiddleware: RequestHandler = (req, res, next) => {
  if (req.headers['content-type'] === 'application/octet-stream') {
    raw()(req, res, next);
  } else {
    json()(req, res, next);
  }
};
