import {
  PropertyType,
  Entity,
  ListProp,
  TextProp,
  NumberProp,
  CheckboxProp,
  DateProp
} from "../../model/interface";

function createNewProp(entity: Entity, propName: string, type: PropertyType) {
  let obj;
  switch (type) {
    case PropertyType.TextProp:
      obj = {
        name: propName,
        type: type,
        label: propName,
        required: false,
        multiline: false
      } as TextProp;
      break;

    case PropertyType.NumberProp:
      obj = {
        name: propName,
        type: type,
        label: propName,
        required: false,
        allowNegative: true,
        allowZero: true
      } as NumberProp;
      break;

    case PropertyType.ListProp:
      obj = {
        name: propName,
        type: type,
        label: propName,
        required: false,
        expandable: false,
        items: [],
        multiple_choice: false
      } as ListProp;
      break;

    case PropertyType.CheckboxProp:
      obj = {
        name: propName,
        type: type,
        label: propName,
        required: false
      } as CheckboxProp;
      break;

    case PropertyType.DateProp:
      obj = {
        name: propName,
        type: type,
        label: propName,
        required: false
      } as DateProp;
      break;

    default:
      obj = null;
      break;
  }

  if (obj != null) entity.properties.push(obj);
}

export default { createNewProp };
