//#region Interfaces

enum PropertyType {
  ListProp = "list",
  TextProp = "text",
  CheckboxProp = "check",
  NumberProp = "number"
}

interface ListProp extends Property {
  items: string[];
  expandable: boolean;
  multiple_choice: boolean;
}

interface TextProp extends Property {
  multiline: Boolean;
}

interface CheckboxProp extends Property {}
interface NumberProp extends Property {}

interface Property {
  name: string;
  required: Boolean;
  type: PropertyType;
}

interface Entity {
  properties: Property[];
}

interface EntityObject {
  entityName: string;
  [key: string]: Object;
}
//#endregion

const n: NumberProp = {
  name: "Alter",
  required: true,
  type: PropertyType.NumberProp
};

const l: ListProp = {
  expandable: false,
  items: ["Achtung", "Gefahr"],
  multiple_choice: false,
  name: "Auswahl",
  required: true,
  type: PropertyType.ListProp
};

const e: Entity = {
  properties: [n, l]
};
