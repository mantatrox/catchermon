/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { OrganizerComponents } from "../";
import { Entity, EntityType } from "../../model/interface";
import { Select, MenuItem, Grid, InputLabel } from "@material-ui/core";

function Draw(props: { entity: Entity }) {
  const [selected, setSelected] = React.useState(EntityType.SIMPLE);

  React.useEffect(() => {
    console.log(props.entity.options.type);
    setSelected(props.entity.options.type);
  }, []);

  return (
    <Grid container direction="column">
      <OrganizerComponents.CheckInput
        label="Elemente farbig hervorheben"
        required={true}
        setHandler={(state) => {
          props.entity.options.useConditionalFormatting = state;
        }}
        value={props.entity.options.useConditionalFormatting}
      />

      <OrganizerComponents.CheckInput
        label="Ersteller anzeigen"
        required={true}
        setHandler={(state) => {
          props.entity.options.showReferent = state;
        }}
        value={props.entity.options.showReferent}
      />

      <InputLabel id="idLabel">Listentyp: </InputLabel>
      <Select
        required={true}
        value={selected}
        labelId="idLabel"
        onChange={(event) => {
          const type = event.target.value as EntityType;
          setSelected(type);
          props.entity.options.type = type;
        }}
      >
        <MenuItem value={EntityType.SIMPLE}>Einfache Liste</MenuItem>
        <MenuItem value={EntityType.REDISTRIBUTE}>Suche/Biete</MenuItem>
      </Select>
    </Grid>
  );
}

export default Draw;
