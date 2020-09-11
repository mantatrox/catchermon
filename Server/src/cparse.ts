import path from "path";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import moment from "moment";
import dh from "./modules/dataHandler";
import { EntityObject, DistributionStatus } from "./model/entities";

const readable = path.resolve(__dirname, "../Mietsiebe_neu.csv");
const input = fs.readFileSync(readable).toString("utf8");

const entityId = "5f44f958069d750700ca930c";

interface InsertObject {
  insertDate: Date;
  anInternal: number;
  anExternal: number;
  clinic: string;
  distributor: string;
  op: Date;
  ab: boolean;
  description: string;
}

const io: InsertObject[] = [];

async function insert() {
  for (const i of io) {
    const e: EntityObject = {
      distribution: { status: DistributionStatus.REPORTED },
      properties: [
        { propKey: "insertDate", propValue: i.insertDate.toString() },
        { propKey: "anInternal", propValue: i.anInternal.toString() },
        { propKey: "anExternal", propValue: i.anExternal.toString() },
        { propKey: "clinic", propValue: i.clinic },
        { propKey: "distributor", propValue: i.distributor },
        { propKey: "op", propValue: i.op.toString() },
        { propKey: "ab", propValue: i.ab.toString() },
        { propKey: "description", propValue: i.description.toString() }
      ],
      referent: "Einkauf"
    };

    for (const prop of e.properties) {
      if (prop.propValue.toLowerCase().trim().includes("invalid"))
        prop.propValue = "";
      if (prop.propValue.toLowerCase().trim() === "nan") prop.propValue = "";
    }

    await dh.objects.create(entityId, e);
  }
}

async function main() {
  const records = parse(input, {
    columns: [
      "insertDate",
      "anInternal",
      "anExternal",
      "clinic",
      "distributor",
      "op",
      "ab",
      "description"
    ],
    skipEmptyLines: true,
    delimiter: ";"
  });

  for (const record of records) {
    try {
      const n: InsertObject = {
        insertDate: moment(record.insertDate, "DD.MM.YYYY").toDate(),
        anInternal: parseInt(record.anInternal),
        anExternal: parseInt(record.anExternal),
        clinic: record.clinic,
        distributor: record.distributor,
        op: moment(record.op, "DD.MM.YYYY").toDate(),
        ab: record.ab.trim() == "X" || record.ab.trim() == "x" ? true : false,
        description: record.description
      };

      io.push(n);
    } catch (error) {
      console.log(error);
    }
  }
  await insert();
  process.exit(0);
}

main();
