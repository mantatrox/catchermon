import React from "react";
import { OrganizerComponents } from "../index";
import { Grid } from "@material-ui/core";
import { TextProp } from "../../model/interface";

function Draw(props: { property: TextProp }) {
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
        label="Multiline"
        required={false}
        value={props.property.multiline}
        setHandler={(value) => {
          props.property.multiline = value;
        }}
      />
    </Grid>
  );
}

export default Draw;
