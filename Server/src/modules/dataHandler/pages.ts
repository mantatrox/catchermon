import { db, config } from "./utils";
import { Page } from "../../model/entities";
import { ObjectId } from "mongodb";
import entities from "./entities";

const get = async (filter = {}, projection = {}, skipEntities = false) => {
  const pages = await db.get<Page>(
    config.database,
    config.collections.pages,
    filter,
    projection
  );

  if (!skipEntities)
    for (const p of pages)
      p.entities = await entities.get({ _id: { $in: p.entities } });

  return pages;
};

const pageExists = async (pageId: string) => {
  const filter = { _id: new ObjectId(pageId) };
  const pages = await db.get<Page>(
    config.database,
    config.collections.pages,
    filter
  );
  return pages.length > 0;
};

const create = async (page: Page) => {
  return await db.insertOne(config.database, config.collections.pages, page);
};

export default { get, pageExists, create };
