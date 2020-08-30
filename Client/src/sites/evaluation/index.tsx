import {
  Box,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import assert from "assert";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EntityObject } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";

interface ClinicCounter {
  clinic: string;
  counter: number;
}

function Draw() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { entity } = useSelector((state: ApplicationState) => {
    return {
      entity: state.io.entity
    };
  });

  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(0);

  const [calculation, setCalculation] = useState<ClinicCounter[]>([]);

  React.useEffect(() => {
    dispatcher.setTabValue(1);
  }, []);

  React.useEffect(() => {
    if (!entity) {
      dispatcher.getEntity("5f44f958069d750700ca930c");
      return;
    }

    setYears(getYears());
  }, [entity]);

  React.useEffect(() => {
    if (years.length === 0) return;
    setSelectedYear(years[0]);
  }, [years]);

  React.useEffect(() => {
    calculate();
  }, [selectedYear]);

  function getYears() {
    if (!entity) return [] as number[];
    return entity.items
      .map((item) => {
        return getItemYear(item);
      })
      .filter((v, i, a) => a.indexOf(v) === i && v > 0)
      .sort((a, b) => b - a);
  }

  function getItemYear(item: EntityObject) {
    if (!entity) return -1;
    const prop = item.properties.find((prop) => prop.propKey === "insertDate");
    if (!prop) return -1;
    const val =
      typeof prop.propValue === "object" ? prop.propValue[0] : prop.propValue;

    const year = moment(val).year();
    assert.strictEqual(typeof year, "number");

    return year;
  }

  function getItemClinic(item: EntityObject) {
    if (!entity) return "";
    const prop = item.properties.find((prop) => prop.propKey === "clinic");
    if (!prop) return "";

    return typeof prop.propValue === "object"
      ? prop.propValue[0]
      : prop.propValue;
  }

  function getClinics(): string[] {
    if (!entity || !entity.items) return [];

    return entity.items
      .map((item) => {
        return getItemClinic(item);
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
  }

  function getNumberByClinic(clinic: string) {
    if (!entity) return -1;

    return entity.items.filter((item) => {
      const cl = getItemClinic(item);
      const year = getItemYear(item);

      return cl === clinic && year === selectedYear;
    }).length;
  }

  function calculate() {
    const calcs: ClinicCounter[] = getClinics().map((clinic) => {
      return { clinic, counter: getNumberByClinic(clinic) };
    });

    let sum = 0;
    calcs.forEach((calc) => (sum += calc.counter));

    calcs.push({ clinic: "Gesamt", counter: sum });

    setCalculation(calcs);
  }

  return (
    <Box style={{ margin: "0.5em" }}>
      <h1>Auswertung</h1>
      <Select
        style={{ minWidth: "2em", width: "fit-content" }}
        value={selectedYear}
        onChange={(event) => {
          const val = event.target.value as string;
          setSelectedYear(parseInt(val));
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Klinik</b>
              </TableCell>
              <TableCell>
                <b>Anzahl</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculation.map((row) => (
              <TableRow key={row.clinic}>
                <TableCell>{row.clinic}</TableCell>
                <TableCell>{row.counter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Draw;
