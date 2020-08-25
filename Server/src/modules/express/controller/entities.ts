import Joi from "@hapi/joi";
import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { Entity } from "../../../model/entities";
import { dataHandler } from "../../index";
import { sendBadRequest, sendInternalServerError, sendOK } from "./utils";

const entitySchema = Joi.object({
  label: Joi.string().required(),
  items: Joi.array(),
  properties: Joi.array(),
  options: Joi.object(),
  _id: Joi.string()
});

const get: RequestHandler = async (req, res) => {
  try {
    const entityId = req.params.entityId;
    if (!entityId) throw new Error("No entity ID given");

    const entities = await dataHandler.entities.get({
      _id: new ObjectId(entityId)
    });

    if (entities.length != 1)
      throw new Error(`Found ${entities.length} instead of 1`);

    sendOK(res, { data: entities });
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const getOpen: RequestHandler = async (req, res) => {
  try {
    const entityId = req.params.entityId;
    if (!entityId) throw new Error("No entity ID given");

    const entities = await dataHandler.entities.get(
      {
        _id: new ObjectId(entityId)
      },
      true
    );

    if (entities.length != 1)
      throw new Error(`Found ${entities.length} instead of 1`);

    sendOK(res, { data: entities });
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const body = req.body.entity as Entity;

    const { error } = entitySchema.validate(body);
    if (error) {
      sendBadRequest(res);

      console.log(error);
      console.log(JSON.stringify(body));
      console.log(JSON.stringify(error));
      return;
    }

    await dataHandler.entities.update(body._id, body);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const create: RequestHandler = async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const body = req.body.entity as Entity;

    const { error } = entitySchema.validate(body);
    if (pageId == "" || error) {
      sendBadRequest(res);

      console.log(error);
      console.log(JSON.stringify(body));
      console.log(JSON.stringify(error));
      return;
    }

    await dataHandler.entities.create(pageId, body);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

export default { get, getOpen, update, create };
