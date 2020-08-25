export enum PropertyType {
  ListProp = "list",
  TextProp = "text",
  CheckboxProp = "check",
  NumberProp = "number",
  DateProp = "date"
}

export interface ListProp extends Property {
  items: string[];
  expandable: boolean;
  multiple_choice: boolean;
}

export interface TextProp extends Property {
  multiline: boolean;
}

export type CheckboxProp = Property;
export type DateProp = Property;

export interface NumberProp extends Property {
  allowZero: boolean;
  allowNegative: boolean;
}

export interface Property {
  name: string;
  required: boolean;
  type: PropertyType;
  label: string;
}
