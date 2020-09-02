/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";
import {
  calculate,
  ClinicCounter,
  exportExcel,
  getYears,
  lastOneFat
} from "./handlers";

import config from "../../config/entities.json";

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
  const [disabled, setDisabled] = useState(false);

  React.useEffect(() => {
    dispatcher.setTabValue(1);
    dispatcher.getEntity(config.siebe);
  }, []);

  React.useEffect(() => {
    if (!entity) return;

    setYears(getYears(entity));
  }, [entity]);

  React.useEffect(() => {
    if (years.length === 0) return;
    setSelectedYear(years[0]);
  }, [years]);

  React.useEffect(() => {
    if (!entity) return;
    calculate(selectedYear, entity, setCalculation);
  }, [selectedYear]);

  return (
    <Box style={{ margin: "2em" }}>
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

      <Button
        variant="contained"
        onClick={() => {
          if (!entity) return;
          setDisabled(true);
          exportExcel({ entity, years });
          setDisabled(false);
        }}
        style={{ marginLeft: "1em" }}
        disabled={disabled}
      >
        Export
      </Button>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" id="exportTable">
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
            {calculation.map((row, index) => (
              <TableRow key={row.clinic}>
                <TableCell>
                  {lastOneFat(row.clinic, index, calculation)}
                </TableCell>
                <TableCell>
                  {lastOneFat(row.counter, index, calculation)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Draw;
