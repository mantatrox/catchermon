export interface Page {
  _id?: string;
  entities: Entity[];
  referent: Reference;
  name: string;
}

export interface Reference {
  label: string;
  items: string[];
}

export interface Expiration {
  expireType: ExpireType;
  offsetType: TimeOffset;
  offset: number;
}

export interface Entity {
  properties: Property[];
  label: string;
  _id?: string;
  items: EntityObject[];
  options: EntityOptions;
}

export enum EntityType {
  SIMPLE = "simple",
  REDISTRIBUTE = "redist"
}

export interface EntityOptions {
  expiration?: Expiration;
  useConditionalFormatting: boolean;
  hiddenProperties: string[];
  type: EntityType;
  showReferent: boolean;
}

export interface EntProp {
  propKey: string;
  propValue: string | string[];
}

export enum DistributionStatus {
  REPORTED = "reported",
  BOOKED = "booked",
  DELIVERED = "delivered",
  EXPIRED = "expired",
  DELETED = "deleted"
}

export enum TimeOffset {
  HOURS = "hours",
  MINUTES = "minutes",
  DAYS = "days"
}

export enum ExpireType {
  ONINSERT = "onInsert",
  ONCOLUMN = "onColumn"
}

export interface Distribution {
  status: DistributionStatus;
  referent?: string;
}

export interface EntityObject {
  insertDate?: Date | string;
  properties: EntProp[];
  distribution?: Distribution;
  _id?: string;
  referent: string;
}

export enum PropertyType {
  ListProp = "list",
  TextProp = "text",
  CheckboxProp = "check",
  NumberProp = "number",
  DateProp = "date"
}

export interface StateReturn {
  values: string[];
  propName: string;
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

export interface NumberProp extends Property {
  allowNegative: boolean;
  allowZero: boolean;
}

export type DateProp = Property;

export interface Property {
  name: string;
  required: boolean;
  type: PropertyType;
  label: string;
}
