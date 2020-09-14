import { db, config } from "./utils";
import { EntityObject, DistributionStatus } from "../../model/entities";
import { ObjectId } from "mongodb";

async function get(filter = {}, projection = {}) {
  const e = await db.get<EntityObject>(
    config.database,
    config.collections.objects,
    filter,
    projection
  );
  return e;
}

async function getByEntity(entityName: string) {
  return await get({ entityName });
}

const create = async (entityId: string, entObj: EntityObject) => {
  const filter = { _id: new ObjectId(entityId) };
  if (!entObj.insertDate) entObj.insertDate = new Date();
  entObj.distribution = { status: DistributionStatus.REPORTED };
  const eId = await db.insertOne(
    config.database,
    config.collections.objects,
    entObj
  );
  const ne = { $push: { items: eId } };

  await db.update(config.database, config.collections.entities, ne, filter);
  return eId;
};

const update = async (entObj: EntityObject) => {
  if (!entObj._id) throw new Error("No Entity Object Id given");

  const _id = new ObjectId(entObj._id);
  await db.update(
    config.database,
    config.collections.objects,
    { $set: { ...entObj, _id } },
    { _id }
  );
};

const book = async (entObjId: string, referent: string) => {
  const _id = new ObjectId(entObjId);
  await db.update(
    config.database,
    config.collections.objects,
    { $set: { distribution: { status: DistributionStatus.BOOKED, referent } } },
    { _id }
  );
};

const deliver = async (entObjId: string, referent: string) => {
  const _id = new ObjectId(entObjId);
  await db.update(
    config.database,
    config.collections.objects,
    {
      $set: { distribution: { status: DistributionStatus.DELIVERED, referent } }
    },
    { _id }
  );
};

const clear = async (entObjId: string) => {
  await db.update(
    config.database,
    config.collections.objects,
    {
      $set: {
        distribution: { status: DistributionStatus.REPORTED, referent: "" }
      }
    },
    { _id: new ObjectId(entObjId) }
  );
};

const remove = async (entObjId: string, referent: string) => {
  await db.update(
    config.database,
    config.collections.objects,
    {
      $set: {
        distribution: { status: DistributionStatus.DELETED, referent }
      }
    },
    { _id: new ObjectId(entObjId) }
  );
};

const expire = async (entObjId: string, referent: string) => {
  await db.update(
    config.database,
    config.collections.objects,
    {
      $set: {
        distribution: { status: DistributionStatus.EXPIRED, referent }
      }
    },
    { _id: new ObjectId(entObjId) }
  );
};

export default {
  get,
  getByEntity,
  create,
  update,
  deliver,
  book,
  clear,
  remove,
  expire
};
