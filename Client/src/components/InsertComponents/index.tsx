import React from "react";
import {
  ListProp,
  PropertyType,
  Property,
  NumberProp,
  CheckboxProp,
  StateReturn,
  TextProp,
  DateProp
} from "../../model/interface";

import List from "./ListInsert";
import Check from "./CheckInsert";
import Text from "./TextInsert";
import Number from "./NumberInsert";
import Date from "./DateInsert";

function Draw(props: {
  solutions: StateReturn[];
  property: Property;
  setHandler(solutions: StateReturn[]): void;
  value?: string;
}) {
  switch (props.property.type) {
    case PropertyType.ListProp:
      return (
        <List
          lp={props.property as ListProp}
          solutions={props.solutions}
          setHandler={props.setHandler}
          value={props.value}
        />
      );

    case PropertyType.TextProp:
      return (
        <Text
          tb={props.property as TextProp}
          solutions={props.solutions}
          setHandler={props.setHandler}
          value={props.value}
        />
      );

    case PropertyType.NumberProp:
      return (
        <Number
          np={props.property as NumberProp}
          solutions={props.solutions}
          setHandler={props.setHandler}
          value={props.value}
        />
      );

    case PropertyType.CheckboxProp:
      return (
        <Check
          cb={props.property as CheckboxProp}
          solutions={props.solutions}
          setHandler={props.setHandler}
          value={props.value}
        />
      );

    case PropertyType.DateProp:
      return (
        <Date
          lp={props.property as DateProp}
          solutions={props.solutions}
          setHandler={props.setHandler}
          value={props.value}
        />
      );

    default:
      return null;
  }
}

export default Draw;
