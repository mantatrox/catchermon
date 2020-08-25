import { Grid } from "@material-ui/core";
import React from "react";
import { NumberProp } from "../../model/interface";
import { OrganizerComponents } from "../index";

function Draw(props: { property: NumberProp }) {
  return (
    <Grid container direction="column">
      <OrganizerComponents.TextInput
        value={props.property.name}
        label="ID:"
        required={true}
        setHandler={(value) => {
          props.property.name = value;
        }}
      />

      <OrganizerComponents.TextInput
        value={props.property.label}
        label="Bezeichner:"
        required={true}
        setHandler={(value) => {
          props.property.label = value;
        }}
      />

      <OrganizerComponents.CheckInput
        label="Benötigt"
        required={false}
        value={props.property.required}
        setHandler={(value) => {
          props.property.required = value;
        }}
      />

      <OrganizerComponents.CheckInput
        label="Negative Zahlen zulassen"
        required={false}
        value={props.property.allowNegative}
        setHandler={(value) => {
          props.property.allowNegative = value;
        }}
      />

      <OrganizerComponents.CheckInput
        label="Nullen zulassen"
        required={false}
        value={props.property.allowZero}
        setHandler={(value) => {
          props.property.allowZero = value;
        }}
      />
    </Grid>
  );
}

export default Draw;
