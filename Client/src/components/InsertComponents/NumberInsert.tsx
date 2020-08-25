/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import { NumberProp, StateReturn } from "../../model/interface";
import { refresh } from "./utils";

function NumberElem(props: {
  np: NumberProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
}) {
  const [state, setState] = useState<string>("");

  React.useEffect(() => {
    refresh(state, props.np, props.solutions, props.setHandler);
  }, [state]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length > 0) {
      let num = parseInt(value);

      if (isNaN(num)) return;

      if (num < 0 && !props.np.allowNegative) num = 0;
      if (num === 0 && !props.np.allowZero) return;

      setState(num.toString());
    } else setState(value);
  };

  return (
    <TextField
      required={props.np.required}
      id={props.np.name}
      label={props.np.label}
      type="number"
      value={state}
      onChange={handleOnChange}
    />
  );
}

export default NumberElem;
