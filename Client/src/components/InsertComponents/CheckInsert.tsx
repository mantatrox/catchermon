/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, FormControlLabel } from "@material-ui/core";
import React, { useState } from "react";
import { CheckboxProp, StateReturn } from "../../model/interface";

function CheckElem(props: {
  cb: CheckboxProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
}) {
  const [state, setState] = useState<boolean>(false);

  React.useEffect(() => {
    const read = props.solutions.find((s) => s.propName === props.cb.name);
    if (read) {
      read.values = [state.toString()];
      props.solutions[props.solutions.indexOf(read)] = read;
    } else {
      props.solutions.push({
        propName: props.cb.name,
        values: [state.toString()]
      });
    }

    props.setHandler(props.solutions);
  }, [state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={state}
          onChange={handleChange}
          name={props.cb.name}
          color="primary"
        />
      }
      label={props.cb.label}
    />
  );
}

export default CheckElem;
