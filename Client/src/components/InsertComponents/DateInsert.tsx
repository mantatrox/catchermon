/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import moment from "moment";
import { DateProp, StateReturn } from "../../model/interface";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import "moment/locale/de";
import { refresh } from "./utils";

function Draw(props: {
  lp: DateProp;
  solutions: StateReturn[];
  setHandler(solutions: StateReturn[]): void;
  value?: string;
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    moment.locale("de");
    if (props.value) setSelectedDate(new Date(props.value));
  }, [props.value]);

  React.useEffect(() => {
    if (!selectedDate) return;

    refresh(
      selectedDate.toISOString(),
      props.lp,
      props.solutions,
      props.setHandler
    );
  }, [selectedDate]);

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date) return;
    setSelectedDate(date.toDate());
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale="de">
      <KeyboardDatePicker
        margin="normal"
        id="date-picker-dialog"
        label={props.lp.label}
        format="DD.MM.yyyy"
        value={selectedDate}
        onKeyUp={(event) => {
          if (event.key === "Enter") setOpen(true);
        }}
        open={open}
        onClick={() => setOpen(true)}
        onChange={handleDateChange}
        onClose={() => {
          setOpen(false);
        }}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
        readOnly={true}
      />
    </MuiPickersUtilsProvider>
  );
}

export default Draw;
