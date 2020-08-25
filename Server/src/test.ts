// import * as config from "./config/db.json";
import { TextProp, PropertyType, ListProp } from "./model/properties";
import { dataHandler } from "./modules";
import {
  Entity,
  EntityObject,
  Page,
  DistributionStatus
} from "./model/entities";

import { DefaultEntityOptions } from "./model/init";
import { exist } from "@hapi/joi";

//Properties

//Büro
const name: TextProp = {
  name: "name",
  multiline: false,
  required: true,
  type: PropertyType.TextProp,
  label: "Bezeichnung"
};

const description: TextProp = {
  name: "description",
  label: "Beschreibung",
  multiline: true,
  required: false,
  type: PropertyType.TextProp
};

const status: ListProp = {
  expandable: false,
  items: [
    "Neuwertig",
    "Leichte Gebrauchsspuren",
    "Starke Gebrauchsspuren",
    "Beschädigt"
  ],
  label: "Zustand",
  multiple_choice: false,
  name: "status",
  required: true,
  type: PropertyType.ListProp
};

const category: ListProp = {
  expandable: true,
  items: ["Möbel", "Schreibwaren", "Sonstiges", "Elektronik"],
  label: "Kategorie",
  multiple_choice: false,
  name: "category",
  required: true,
  type: PropertyType.ListProp
};

//Essen
const kostform: ListProp = {
  expandable: false,
  items: ["Vollkost", "Leichte Kost", "Passiert", "Salatschüssel"],
  label: "Kostform",
  multiple_choice: false,
  name: "form",
  required: true,
  type: PropertyType.ListProp
};

const mahlzeit: ListProp = {
  expandable: false,
  label: "Mahlzeit",
  multiple_choice: false,
  name: "time",
  required: true,
  type: PropertyType.ListProp,
  items: ["Frühstück", "Mittagessen", "Abendessen"]
};

//Entities
const BA: Entity = {
  properties: [name, description, status, category],
  label: "Büroartikel",
  items: [],
  options: DefaultEntityOptions
};

const meal: Entity = {
  properties: [kostform, mahlzeit],
  label: "Essen",
  items: [],
  options: DefaultEntityOptions
};

//Pages

const mealPage: Page = {
  entities: [],
  referent: {
    label: "Stationen",
    items: ["A4", "A5", "B4", "B7", "C1", "D3", "IT"]
  },
  name: "HeliosAue"
};

const baObjects: EntityObject[] = [
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "name", propValue: "Stuhl" },
      { propKey: "description", propValue: "Ein Stuhl" },
      { propKey: "status", propValue: "Neuwertig" },
      { propKey: "category", propValue: "Möbel" }
    ],
    referent: "A4"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "name", propValue: "Kugelschreiber" },
      { propKey: "description", propValue: "Kaputter Kugelschreiber, sorry" },
      { propKey: "status", propValue: "Beschädigt" },
      { propKey: "category", propValue: "Schreibwaren" }
    ],
    referent: "A5"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "name", propValue: "Mainboard" },
      { propKey: "description", propValue: "Asus Mainboard" },
      { propKey: "status", propValue: "Leichte Gebrauchsspuren" },
      { propKey: "category", propValue: "Elektronik" }
    ],
    referent: "C1"
  }
];

const mealObjects: EntityObject[] = [
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "form", propValue: "Vollkost" },
      { propKey: "time", propValue: "Frühstück" }
    ],
    referent: "B4"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "form", propValue: "Vollkost" },
      { propKey: "time", propValue: "Frühstück" }
    ],
    referent: "B7"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "form", propValue: "Leichte Kost" },
      { propKey: "time", propValue: "Abendessen" }
    ],
    referent: "C1"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "form", propValue: "Vollkost" },
      { propKey: "time", propValue: "Frühstück" }
    ],
    referent: "D3"
  },
  {
    distribution: { status: DistributionStatus.REPORTED },
    properties: [
      { propKey: "form", propValue: "Passiert" },
      { propKey: "time", propValue: "Mittagessen" }
    ],
    referent: "A4"
  }
];

export const createPages = async () => {
  try {
    const mealId = await dataHandler.pages.create(mealPage);

    const mealEId = await dataHandler.entities.create(mealId, meal);
    const baEId = await dataHandler.entities.create(mealId, BA);

    for (const o of mealObjects) await dataHandler.objects.create(mealEId, o);
    for (const o of baObjects) await dataHandler.objects.create(baEId, o);

    console.log("Done creating");
    process.exit(0);
  } catch (error) {
    console.log("Couldn't create entities");
    console.log(error);
  }
};
