/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { StateReturn, TextProp } from "../../model/interface";

function TextElem(props: {
  tb: TextProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
}) {
  const [state, setState] = useState<string>("");

  React.useEffect(() => {
    const read = props.solutions.find((s) => s.propName === props.tb.name);
    if (read) {
      if (state === "") read.values = [];
      else read.values = [state];
      props.solutions[props.solutions.indexOf(read)] = read;
    } else {
      props.solutions.push({ propName: props.tb.name, values: [] });
    }

    props.setHandler(props.solutions);
  }, [state]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  return (
    <TextField
      required={props.tb.required}
      id={props.tb.name}
      label={props.tb.label}
      multiline={props.tb.multiline}
      type="text"
      onChange={handleOnChange}
    />
  );
}

export default TextElem;
