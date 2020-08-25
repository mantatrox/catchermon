/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Entity, TimeOffset, ExpireType } from "../../model/interface";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField
} from "@material-ui/core";

import { OrganizerComponents, SimpleComponents } from "../";

function Draw(props: { entity: Entity }) {
  const [init, setInit] = React.useState(false);
  const [expires, setExpires] = React.useState(
    props.entity.options && props.entity.options.expiration ? true : false
  );
  const [expireType, setExpireType] = React.useState(ExpireType.ONINSERT);
  const [expireOffsetType, setExpiresOffsetType] = React.useState(
    TimeOffset.MINUTES
  );
  const [expireOffset, setExpireOffset] = React.useState("");

  React.useEffect(() => {
    if (init) return;

    if (!props.entity.options.expiration) {
      setInit(true);
      return;
    }

    setExpireType(props.entity.options.expiration.expireType);
    setExpiresOffsetType(props.entity.options.expiration.offsetType);
    setExpireOffset(props.entity.options.expiration.offset.toString());

    setInit(true);
  }, [props.entity]);

  React.useEffect(() => {
    console.log(expires);
  }, [expires]);

  React.useEffect(() => {
    if (!init) return;
    if (!expires) props.entity.options.expiration = undefined;
    else {
      const offset = parseInt(expireOffset);
      props.entity.options.expiration = {
        expireType,
        offset: isNaN(offset) ? 0 : offset,
        offsetType: expireOffsetType
      };
    }
  }, [expires, expireType, expireOffsetType, expireOffset]);

  return (
    <Grid container direction="column">
      <OrganizerComponents.CheckInput
        value={expires}
        label="Objekte laufen ab"
        required={false}
        setHandler={setExpires}
      />

      <SimpleComponents.Hider hidden={!expires}>
        <FormControl required>
          <InputLabel id="demo-simple-select-required-label">
            Läuft ab an:
          </InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={expireType}
            onChange={(event) => {
              setExpireType(event.target.value as ExpireType);
            }}
          >
            <MenuItem value={ExpireType.ONINSERT}>Erstelldatum</MenuItem>
            <MenuItem value={ExpireType.ONCOLUMN}>An Datumeigenschaft</MenuItem>
          </Select>
        </FormControl>
        <Grid container direction="row">
          <Grid item sm={4}>
            <FormControl required>
              <TextField
                required={true}
                id="offsetText"
                type="number"
                label="Nach:"
                value={expireOffset}
                onChange={(event) => {
                  setExpireOffset(event.target.value);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item sm={8}>
            <FormControl required>
              <InputLabel id="offsetlabel"></InputLabel>
              <Select
                labelId="offsetlabel"
                id="offset"
                value={expireOffsetType}
                onChange={(event) => {
                  setExpiresOffsetType(event.target.value as TimeOffset);
                }}
              >
                <MenuItem value={TimeOffset.MINUTES}>Minuten</MenuItem>
                <MenuItem value={TimeOffset.HOURS}>Stunden</MenuItem>
                <MenuItem value={TimeOffset.DAYS}>Tage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SimpleComponents.Hider>
    </Grid>
  );
}

export default Draw;
