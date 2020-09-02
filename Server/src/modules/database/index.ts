import autoBind from "auto-bind";
import { MongoClient } from "mongodb";

export interface MCOptions {
  host: string;
  user: string;
  password: string;
  needsAuthentication: boolean;
}

class MC {
  private client: MongoClient;
  private options: MCOptions;

  constructor(options: MCOptions) {
    autoBind(this);
    this.options = options;
  }

  private async init(database: string, collection: string) {
    const url = `mongodb://${this.options.host}`;
    const o = this.options.needsAuthentication
      ? {
          useUnifiedTopology: true,
          auth: {
            password: this.options.password,
            user: this.options.user
          }
        }
      : {
          useUnifiedTopology: true
        };
    this.client = await MongoClient.connect(url, o);

    return this.client.db(database).collection(collection);
  }

  async get<T>(
    database: string,
    collection: string,
    filter = {},
    projection = {}
  ) {
    const c = await this.init(database, collection);
    const result = await c.find(filter).project(projection).toArray();
    return result as T[];
  }

  async getSingle<T>(
    database: string,
    collection: string,
    filter: unknown,
    projection = {}
  ) {
    const c = await this.init(database, collection);
    const result = await c.findOne(filter, { projection });

    return result as T;
  }

  async insertOne(database: string, collection: string, doc: unknown) {
    const c = await this.init(database, collection);
    const result = await c.insertOne(doc);
    return result.insertedId as string;
  }

  async update(
    database: string,
    collection: string,
    doc: unknown,
    filter: unknown,
    options = {}
  ) {
    const c = await this.init(database, collection);
    await c.updateOne(filter, doc, options);
  }

  async aggregate<T>(
    database: string,
    collection: string,
    from: string,
    localField: string,
    foreignField: string,
    as: string
  ) {
    const c = await this.init(database, collection);
    const result: T[] = await c
      .aggregate([{ $lookup: { from, localField, foreignField, as } }])
      .toArray();

    return result;
  }

  async remove(database: string, collection: string, filter = {}) {
    const c = await this.init(database, collection);
    await c.remove(filter);
  }
}

export default { MC };
