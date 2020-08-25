/* eslint-disable react-hooks/exhaustive-deps */
import {
  Chip,
  Input,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from "@material-ui/core";
import React, { useState } from "react";
import { ListProp, StateReturn } from "../../model/interface";

const ListElem = (props: {
  lp: ListProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
}) => {
  const [values, setValues] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValues(event.target.value as string[]);
  };

  React.useEffect(() => {
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
      <Select labelId={props.lp.label} id={"Select"} onChange={handleChange}>
        {props.lp.items.map((item) => {
          return (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          );
        })}
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
        onChange={handleChange}
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
        {props.lp.items.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  return props.lp.multiple_choice ? multiSelect : singleSelect;
};

export default ListElem;
