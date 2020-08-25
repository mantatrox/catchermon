import React from "react";
import List from "./listPropOptions";
import Number from "./numberPropOptions";
import Text from "./textPropOption";
import Check from "./checkPropOptions";
import Date from "./datePropOptions";

import {
  Property,
  PropertyType,
  CheckboxProp,
  ListProp,
  NumberProp,
  TextProp,
  DateProp
} from "../../model/interface";

function Options(props: { property: Property }) {
  let p;
  switch (props.property.type) {
    case PropertyType.CheckboxProp:
      p = props.property as CheckboxProp;
      return <Check property={p} />;

    case PropertyType.ListProp:
      p = props.property as ListProp;
      return <List property={p} />;

    case PropertyType.NumberProp:
      p = props.property as NumberProp;
      return <Number property={p} />;

    case PropertyType.TextProp:
      p = props.property as TextProp;
      return <Text property={p} />;

    case PropertyType.DateProp:
      p = props.property as DateProp;
      return <Date property={p} />;

    default:
      return null;
  }
}

export default Options;
