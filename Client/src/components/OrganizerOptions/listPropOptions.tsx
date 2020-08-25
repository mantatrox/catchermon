import { Grid } from "@material-ui/core";
import React from "react";
import { ListProp } from "../../model/interface";
import { OrganizerComponents } from "../index";

function Draw(props: { property: ListProp }) {
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
        label="Erweiterbar"
        required={false}
        value={props.property.expandable}
        setHandler={(value) => {
          props.property.expandable = value;
        }}
      />

      <OrganizerComponents.CheckInput
        label="Mehrfachauswahl"
        required={false}
        value={props.property.multiple_choice}
        setHandler={(value) => {
          props.property.multiple_choice = value;
        }}
      />

      <OrganizerComponents.ListInput
        label="Elemente"
        items={props.property.items}
        setHandler={(items) => {
          props.property.items = items;
        }}
      />
    </Grid>
  );
}

export default Draw;
