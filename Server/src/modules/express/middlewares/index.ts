import { verify, sign } from "jsonwebtoken";
import config from "../../../config/jwt.json";
import { Request, RequestHandler } from "express";
import { sendUnauthorized } from "../controller/utils";

export interface JwtPayload {
  id: number;
  encoded?: string;
}

export interface JwtRequest extends Request {
  jwt?: JwtPayload;
}

function getBearerToken(req: JwtRequest) {
  let token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token || typeof token !== "string") return null;
  if (token.startsWith("Bearer ")) token = token.slice(7);
  return token;
}

export const generate = (payload: JwtPayload) => {
  return sign(payload, config.secret, { expiresIn: config.expiresIn });
};

export const check: RequestHandler = async (req: JwtRequest, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) return sendUnauthorized(res);
    verify(token, config.secret, (err, data) => {
      if (err) return res.status(401).send({ message: "invalid token" });
      const payload = data as JwtPayload;
      req.jwt = payload;
      return next();
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
    throw error;
  }
};
