import { ObjectId } from "mongodb";
import { Entity, DistributionStatus } from "../../model/entities";
import objects from "./objects";
import pages from "./pages";
import { db, config } from "./utils";

async function get(filter = {}, open = false) {
  const entities = await db.get<Entity>(
    config.database,
    config.collections.entities,
    filter
  );

  for (const e of entities) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let objFilter: any = { _id: { $in: e.items } };
    if (open)
      objFilter = {
        ...objFilter,
        "distribution.status": {
          $nin: [
            DistributionStatus.DELETED,
            DistributionStatus.DELIVERED,
            DistributionStatus.EXPIRED
          ]
        }
      };
    e.items = await objects.get(objFilter);
  }

  return entities;
}

const create = async (pageId: string, entity: Entity) => {
  const b = await pages.pageExists(pageId);
  if (!b) throw new Error("Page does not exist");

  const eId = await db.insertOne(
    config.database,
    config.collections.entities,
    entity
  );
  const filter = { _id: new ObjectId(pageId) };
  const ne = { $push: { entities: eId } };

  await db.update(config.database, config.collections.pages, ne, filter);
  return eId;
};

async function update(id: string, entity: Entity) {
  const en = entity as Entity;
  const e = await db.getSingle<Entity>(
    config.database,
    config.collections.entities,
    { _id: new ObjectId(id) }
  );
  if (e == null) throw new Error("Entity was not found.");

  const ne = {
    $set: {
      label: en.label,
      properties: en.properties,
      options: en.options
    }
  };

  await db.update(config.database, config.collections.entities, ne, {
    _id: new ObjectId(id)
  });
  return await db.getSingle<Entity>(
    config.database,
    config.collections.entities,
    { _id: new ObjectId(id) }
  );
}

export default { get, update, create };
