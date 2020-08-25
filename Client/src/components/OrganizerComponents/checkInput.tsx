import React, { useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

function CheckInput(props: {
  value: boolean;
  label: string;
  required: boolean;
  setHandler(value: boolean): any;
}) {
  const [cs, setCs] = useState<boolean>(false);

  React.useEffect(() => {
    setCs(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={cs}
          onChange={(event) => {
            setCs(event.target.checked);
            props.setHandler(event.target.checked);
          }}
          color="primary"
          required={props.required}
        />
      }
      label={props.label}
    />
  );
}

export default CheckInput;
