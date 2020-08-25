import fs from "fs";
import Joi from "@hapi/joi";
import path from "path";

interface DbConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  needsAuthentication: boolean;
  collections: {
    entities: string;
    objects: string;
    users: string;
    pages: string;
    log: string;
  };
}

const init: DbConfig = {
  host: "",
  database: "",
  user: "",
  password: "",
  needsAuthentication: false,

  collections: {
    entities: "entities",
    objects: "objects",
    users: "users",
    pages: "pages",
    log: "log"
  }
};

function get() {
  const p = path.resolve(__dirname, "db.json");
  const configSchema = Joi.object({
    user: Joi.string(),
    password: Joi.string(),
    host: Joi.string().required(),
    database: Joi.string().required(),
    needsAuthentication: Joi.boolean().required(),
    collections: Joi.object({
      entities: Joi.string().required(),
      objects: Joi.string().required(),
      users: Joi.string().required(),
      pages: Joi.string().required(),
      log: Joi.string().required()
    })
  });

  try {
    if (!fs.existsSync(p)) throw new Error("File doesn't exist");

    const content = fs.readFileSync(p, {
      encoding: "utf8"
    });
    const object = JSON.parse(content);

    const { error } = configSchema.validate(object);
    if (error) throw error;

    return object as DbConfig;
  } catch (error) {
    console.log(error.message);

    if (fs.existsSync(p)) fs.unlinkSync(p);

    fs.writeFileSync(p, JSON.stringify(init));

    console.log("New file was generated. Please configure your connection.");
    process.exit(-1);
  }
}

export default get;
