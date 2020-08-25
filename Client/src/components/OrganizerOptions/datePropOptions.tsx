import React from "react";
import { OrganizerComponents } from "../index";
import { Grid } from "@material-ui/core";
import { DateProp } from "../../model/interface";

function Draw(props: { property: DateProp }) {
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
    </Grid>
  );
}

export default Draw;
