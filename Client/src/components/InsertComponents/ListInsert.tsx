/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chip,
  FormControl,
  Input,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select
} from "@material-ui/core";
import React, { useState } from "react";
import { ListProp, StateReturn } from "../../model/interface";

function DrawListElements(props: ListProp) {
  const elements: JSX.Element[] = [];

  const uncat = props.items.find((i) => i.category === "none");
  const cat = props.items.filter((i) => i.category !== "none");

  if (uncat)
    for (const element of uncat.items) {
      elements.push(
        <MenuItem key={`me_${element}`} value={element}>
          {element}
        </MenuItem>
      );
    }

  for (const element of cat) {
    elements.push(
      <ListSubheader key={`lsh_${element.category}`}>
        {element.category}
      </ListSubheader>
    );

    for (const item of element.items) {
      elements.push(
        <MenuItem value={item} key={`mec_${item}`}>
          {item}
        </MenuItem>
      );
    }
  }

  return elements;
}

const ListElem = (props: {
  lp: ListProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
  value?: string;
}) => {
  const [values, setValues] = useState<string[]>([]);

  React.useEffect(() => {
    if (props.value) setValues([props.value]);
  }, [props.value]);

  React.useEffect(() => {
    if (!values) return;
    const read = props.solutions.find((s) => s.propName === props.lp.name);
    const v = [] as string[];
    if (typeof values == "string") v.push(values);
    else for (const val of values) v.push(val);
    if (read) {
      read.values = v;
      props.solutions[props.solutions.indexOf(read)] = read;
    } else props.solutions.push({ propName: props.lp.name, values: v });
    props.setHandler(props.solutions);
  }, [values]);

  if (!props.lp.items) return null;

  const singleSelect = (
    <FormControl required={props.lp.required}>
      <InputLabel>{props.lp.label}</InputLabel>
      <Select
        labelId={props.lp.label}
        id={"Select"}
        onChange={(event) => setValues(event.target.value as string[])}
        value={values}
      >
        {DrawListElements(props.lp)}
      </Select>
    </FormControl>
  );

  const multiSelect = (
    <FormControl required={props.lp.required}>
      <InputLabel id="demo-mutiple-chip-label">{props.lp.label}</InputLabel>
      <Select
        labelId="demo-mutiple-chip-label"
        id="demo-mutiple-chip"
        multiple
        value={values}
        onChange={(event) => setValues(event.target.value as string[])}
        required={props.lp.required}
        input={<Input id="select-multiple-chip" />}
        renderValue={(selected) => (
          <div>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} />
            ))}
          </div>
        )}
      >
        {DrawListElements(props.lp)}
      </Select>
    </FormControl>
  );
  return props.lp.multiple_choice ? multiSelect : singleSelect;
};

export default ListElem;
