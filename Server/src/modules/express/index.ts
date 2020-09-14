/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from "express";
import { json, urlencoded } from "body-parser";
import router from "./router";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { serve } from "./socket";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

app.use(function (_, res, next) {
  // FIXME: Access-Control-Allow-Origin
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api", router);
app.get("/", (_, res) => {
  res.send("Bunny in a pit");
});

export default function (port: number) {
  const server = http.createServer(app);
  serve(server, port);
}
