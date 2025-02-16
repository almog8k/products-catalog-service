import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

interface LBRequest extends Request {
  userId?: string;
  headers: IncomingHttpHeaders & {
    ["User-Id"]?: string;
  };
}

export const attachUserId = (
  req: LBRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["User-Id"];

  if (userId) {
    req.userId = userId;
  } else {
    return res.status(400).send("User-Id header is required");
  }

  next();
};
