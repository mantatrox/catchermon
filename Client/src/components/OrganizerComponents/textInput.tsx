import React from "react";
import { TextField } from "@material-ui/core";

function TextInput(props: {
  value: string;
  label: string;
  required: boolean;
  setHandler(value: string): any;
}) {
  return (
    <TextField
      required={props.required}
      label={props.label}
      defaultValue={props.value}
      onChange={(event) => {
        props.setHandler(event.target.value);
      }}
    />
  );
}

export default TextInput;
