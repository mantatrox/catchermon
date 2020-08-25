import Joi from "@hapi/joi";
import { RequestHandler } from "express";
import { PostObject } from "../../../model/entities";
import { dataHandler } from "../../index";
import { sendBadRequest, sendInternalServerError, sendOK } from "./utils";

interface Delivery {
  objectId: string;
  referent: string;
}

const deliverSchema = Joi.object({
  objectId: Joi.string().required(),
  referent: Joi.string().required()
});

const create: RequestHandler = async (req, res) => {
  try {
    const body = req.body as PostObject;

    const schema = Joi.object({
      entityId: Joi.string().required(),
      item: Joi.object({
        referent: Joi.string().required(),
        properties: Joi.array()
          .items(
            Joi.object({
              propKey: Joi.string().required(),
              propValue: Joi.alternatives().try(
                Joi.string().required(),
                Joi.array().items(Joi.string()).min(1).required()
              )
            })
          )
          .min(1)
      })
    });

    const { error } = schema.validate(body);
    if (error) {
      sendBadRequest(res);

      console.log(JSON.stringify(body));
      console.log(JSON.stringify(error));
      return;
    }

    await dataHandler.objects.create(body.entityId, body.item);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const book: RequestHandler = async (req, res) => {
  try {
    const body = req.body.delivery as Delivery;

    const { error } = deliverSchema.validate(body);
    if (error) {
      sendBadRequest(res);
      console.log(error);
      return;
    }

    await dataHandler.objects.book(body.objectId, body.referent);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const deliver: RequestHandler = async (req, res) => {
  try {
    const body = req.body.delivery as Delivery;

    const { error } = deliverSchema.validate(body);
    if (error) {
      sendBadRequest(res);
      console.log(error);
      return;
    }

    await dataHandler.objects.deliver(body.objectId, body.referent);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const clear: RequestHandler = async (req, res) => {
  try {
    const body = req.body.delivery as Delivery;

    const { error } = deliverSchema.validate(body);
    if (error) {
      sendBadRequest(res);
      console.log(error);
      return;
    }

    await dataHandler.objects.clear(body.objectId);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    const body = req.body.delivery as Delivery;

    const { error } = deliverSchema.validate(body);
    if (error) {
      sendBadRequest(res);
      console.log(error);
      return;
    }

    await dataHandler.objects.remove(body.objectId, body.referent);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

export default { create, book, deliver, clear, remove };
