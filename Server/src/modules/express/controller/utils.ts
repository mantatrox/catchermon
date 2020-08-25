import { Response } from "express";

const sendInternalServerError = (res: Response) => {
  res.status(500).end();
};

const sendBadRequest = (res: Response) => {
  res.status(400).end();
};

const sendOK = (res: Response, body?: unknown) => {
  if (body) res.send(body);
  else res.status(204).end();
};
const sendUnauthorized = (res: Response) => {
  res.status(403).end();
};

export { sendBadRequest, sendOK, sendInternalServerError, sendUnauthorized };
