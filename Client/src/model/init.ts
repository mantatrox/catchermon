import { Entity, EntityOptions, EntityType } from "./interface";

const DefaultEntityOptions: EntityOptions = {
  useConditionalFormatting: false,
  hiddenProperties: [],
  expiration: undefined,
  type: EntityType.SIMPLE,
  showReferent: false
};

const DefaultEntity: Entity = {
  label: "",
  items: [],
  properties: [],
  options: DefaultEntityOptions
};

export { DefaultEntity, DefaultEntityOptions };
