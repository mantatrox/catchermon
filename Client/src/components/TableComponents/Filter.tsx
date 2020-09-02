import React, { useState } from "react";

import { TextField, Grid, Chip } from "@material-ui/core";

export interface ChipData {
  key: number;
  label: string;
}

export const filterTextOnKeyUp = (
  event: React.KeyboardEvent<HTMLDivElement>,
  chips: ChipData[],
  chipText: string
) => {
  const possibleKeys = ["Enter", "Tab", " "];
  if (!possibleKeys.includes(event.key)) return chips;

  const newChip = chipText.trim();
  if (newChip === "") return chips;

  const nc = [...chips];
  nc.push({ key: chips.length, label: newChip });

  return nc;
};

export const filterTextOnKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  chips: ChipData[],
  chipText: string
) => {
  if (event.key !== "Backspace" || chipText !== "") return chips;
  const nc = chips.slice(0, chips.length - 1);
  return nc;
};

function Draw(props: { chips: ChipData[]; setChips(chips: ChipData[]): void }) {
  const [filterText, setFilterText] = useState("");

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        label="Filter:"
        onChange={(event) => {
          setFilterText(event.target.value);
        }}
        style={{
          width: "100%",
          marginLeft: "1em"
        }}
        value={filterText}
        onKeyUp={(event) => {
          const nc = filterTextOnKeyUp(event, props.chips, filterText);
          if (nc.length === props.chips.length) return;
          props.setChips(nc);
          setFilterText("");
        }}
        onKeyDown={(event) => {
          const nc = filterTextOnKeyDown(event, props.chips, filterText);
          if (nc.length === props.chips.length) return;
          props.setChips(nc);
          setFilterText("");
        }}
      />
      <Grid
        component="ul"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          width: "max-content"
        }}
        direction="row"
        container
      >
        {props.chips.map((chip) => {
          return (
            <Grid item component="li" key={chip.key}>
              <Chip
                style={{ margin: "0.5em" }}
                label={chip.label}
                onDelete={() => {
                  const nc = props.chips.filter((c) => c.key !== chip.key);
                  props.setChips(nc);
                }}
                size="small"
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default Draw;
