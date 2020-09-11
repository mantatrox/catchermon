import {
  Entity,
  PropertyType,
  StateReturn,
  Property,
  EntityObject
} from "../../model/interface";
import Joi from "@hapi/joi";

export const check = (entity: Entity, solutions: StateReturn[]) => {
  for (const p of entity.properties) {
    switch (p.type) {
      case PropertyType.ListProp:
        const schemaL = Joi.object({
          propName: Joi.string().required(),
          values: p.required
            ? Joi.array().items(Joi.string()).min(1).required()
            : Joi.array().items(Joi.string()).min(1)
        });

        const lp = solutions.find((s) => s.propName === p.name);
        const { error: errorL } = schemaL.validate(lp);
        if (errorL) return false;

        break;

      case PropertyType.TextProp:
        const schemaT = Joi.object({
          propName: p.required ? Joi.string().required() : Joi.string(),
          values: p.required
            ? Joi.array().items(Joi.string()).length(1).required()
            : Joi.array().items(Joi.string()).max(1)
        });

        const tp = solutions.find((s) => s.propName === p.name);
        const { error: errorT } = schemaT.validate(tp);
        if (errorT) {
          return false;
        }
        break;

      case PropertyType.NumberProp:
        const schemaN = Joi.object({
          propName: p.required ? Joi.string().required() : Joi.string(),
          values: p.required
            ? Joi.array().items(Joi.string()).length(1).required()
            : Joi.array().items(Joi.string()).max(1)
        });
        const np = solutions.find((s) => s.propName === p.name);
        const { error: errorN } = schemaN.validate(np);
        if (errorN) {
          return false;
        }
        break;

      case PropertyType.CheckboxProp:
        break;
      default:
        break;
    }
  }

  return true;
};

export const getValue = (prop: Property, obj?: EntityObject) => {
  try {
    if (obj === undefined) return undefined;
    const entProp = obj.properties.find((o) => o.propKey === prop.name);
    if (entProp === undefined) return undefined;
    const v = entProp.propValue.toString();
    return v;
  } catch (error) {
    console.log(error);
    console.log(prop.name);
    return undefined;
  }
};
