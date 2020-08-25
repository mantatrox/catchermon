import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { dataHandler } from "../../index";
import { sendInternalServerError, sendOK } from "./utils";

const get: RequestHandler = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const eFilter = pageId ? { _id: new ObjectId(pageId) } : {};
    const skip = pageId == undefined ? true : false;

    const pages = await dataHandler.pages.get(eFilter, {}, skip);

    sendOK(res, { data: pages });
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

export default { get };
