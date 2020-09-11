import config from "../../config/api.json";
import { Entity } from "../../model/interface";
import { DefaultEntity } from "../../model/init";
import { getter, poster, putter } from "./utils";

const get = async (entityId: string) => {
  const url = `${config.baseUrl}/entities/${entityId}`;
  return await getter<Entity>(url);
};

const getOpen = async (entityId: string) => {
  const url = `${config.baseUrl}/entities/${entityId}/open`;
  return await getter<Entity>(url);
};

const update = async (entity: Entity) => {
  const url = `${config.baseUrl}/entities`;
  const { items, ...custom } = entity;
  return await poster(url, { custom });
};

const create = async (pageId: string, entityLabel: string) => {
  const url = `${config.baseUrl}/entities/${pageId}`;
  const entity = DefaultEntity;
  entity.label = entityLabel;

  return await putter(url, { entity });
};

export default { get, getOpen, update, create };
