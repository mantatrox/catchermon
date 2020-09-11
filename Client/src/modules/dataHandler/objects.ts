import config from "../../config/api.json";
import { EntityObject } from "../../model/interface";
import { poster, putter } from "./utils";

const create = async (entityId: string, item: EntityObject) => {
  const url = `${config.baseUrl}/objects`;
  return await putter(url, { entityId, item });
};

const deliver = async (objectId: string, referent: string) => {
  const url = `${config.baseUrl}/objects/deliver`;
  return await poster(url, { delivery: { objectId, referent } });
};

const book = async (objectId: string, referent: string) => {
  const url = `${config.baseUrl}/objects/book`;
  return await poster(url, { delivery: { objectId, referent } });
};

const clear = async (objectId: string, referent: string) => {
  const url = `${config.baseUrl}/objects/clear`;
  return await poster(url, { delivery: { objectId, referent } });
};

const remove = async (objectId: string, referent: string) => {
  const url = `${config.baseUrl}/objects/remove`;
  return await poster(url, { delivery: { objectId, referent } });
};

const update = async (entObj: EntityObject) => {
  const url = `${config.baseUrl}/objects`;
  return await poster(url, { entObj });
};

export default { create, deliver, book, clear, remove, update };
