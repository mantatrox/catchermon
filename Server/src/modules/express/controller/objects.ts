import Joi from "@hapi/joi";
import { RequestHandler } from "express";
import { PostObject, EntityObject } from "../../../model/entities";
import { dataHandler } from "../../index";
import { sendBadRequest, sendInternalServerError, sendOK } from "./utils";
import { emitChange } from "../socket";

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
    console.log(body.entityId);
    const pageId = (await dataHandler.pages.getByEntityId(body.entityId))._id;
    emitChange(pageId, body.entityId);

    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const body = req.body.entObj as EntityObject;
    const schema = Joi.object({
      _id: Joi.string().required(),
      referent: Joi.string().required(),
      properties: Joi.array().items(
        Joi.object({
          propKey: Joi.string().required(),
          propValue: Joi.alternatives().try(
            Joi.string().required(),
            Joi.array().items(Joi.string())
          )
        })
      ),
      insertDate: Joi.string(),
      distribution: Joi.object()
    });
    const { error } = schema.validate(body);

    if (error) {
      sendBadRequest(res);
      console.log(error);
      return;
    }

    await dataHandler.objects.update(body);
    const pageId = (await dataHandler.pages.getByEntityId(body._id))._id;
    emitChange(pageId, body._id);
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
    const entityId = (await dataHandler.entities.getByObjectId(body.objectId))
      ._id;
    const pageId = (await dataHandler.pages.getByEntityId(entityId))._id;
    emitChange(pageId, entityId);

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
    const entityId = (await dataHandler.entities.getByObjectId(body.objectId))
      ._id;
    const pageId = (await dataHandler.pages.getByEntityId(entityId))._id;
    emitChange(pageId, entityId);
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
    const entityId = (await dataHandler.entities.getByObjectId(body.objectId))
      ._id;
    const pageId = (await dataHandler.pages.getByEntityId(entityId))._id;
    emitChange(pageId, entityId);
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
    const entityId = (await dataHandler.entities.getByObjectId(body.objectId))
      ._id;
    const pageId = (await dataHandler.pages.getByEntityId(entityId))._id;
    emitChange(pageId, entityId);
    sendOK(res);
  } catch (error) {
    sendInternalServerError(res);
    throw error;
  }
};

export default { create, book, deliver, clear, remove, update };
