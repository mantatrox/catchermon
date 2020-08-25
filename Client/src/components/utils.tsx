import React from "react";
import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import { Entity, Page } from "../model/interface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  })
);

export const DrawEntities = (props: {
  entities: Entity[];
  onchange: React.ChangeEventHandler<{ value: unknown }>;
}) => {
  const classes = useStyles();
  if (props.entities && props.entities.length > 0)
    return (
      <FormControl className={classes.formControl}>
        <InputLabel id="entities">Entities: </InputLabel>
        <Select labelId="entities" onChange={props.onchange}>
          {props.entities.map((p) => {
            return (
              <MenuItem value={p._id} key={p._id}>
                {p.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  return <div></div>;
};

export const drawPages = (
  pages: Page[],
  onchange: React.ChangeEventHandler<{ value: unknown }>
) => {
  if (pages && pages.length > 0)
    return (
      <>
        <InputLabel id="pages">Seiten: </InputLabel>
        <Select labelId="pages" onChange={onchange}>
          {pages.map((p) => {
            return (
              <MenuItem value={p._id} key={p._id}>
                {p._id}
              </MenuItem>
            );
          })}
        </Select>
      </>
    );

  return <div>No Pages</div>;
};
