import React from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from "@material-ui/core";
import { dispatcher as IoDispatcher } from "../store/io";
import { useDispatch } from "react-redux";

function createData(sieb: string, who: string, whoToInform: string) {
  return { sieb, who, whoToInform };
}

const at = "alle im Ticket genannten Kontakte";

const rows = [
  createData("Vogelsang", "OP-Pfleger Volker Kurts", at),
  createData("Zerbst", "OP-Schwester Birgit Giehl", at),
  createData("Burg", "Burg OP", at),
  createData("Köthen", "der Arzt", at),
  createData("Oschersleben", "OC OP", at),
  createData("Berlin Buch", "der Arzt", at),
  createData("Berlin EvB", "der Arzt", at),
  createData("Bad Saarow", "der Arzt", at),
  createData(
    "Aue",
    "der Arzt, die Sekretärin",
    "Sven.Freitag@helios-gesundheit.de"
  ),
  createData(
    "MVZ Stollberg",
    "Fr. Mauersberger/Fr. Dostmann",
    "Andreas.Fischer3@helios-gesundheit.de, christian.hendel@helios-gesundheit.de"
  )
];

function Draw() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  React.useEffect(() => {
    dispatcher.setTabValue(2);
  }, []);

  return (
    <TableContainer style={{ margin: "2em" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Mietsiebe</b>
            </TableCell>
            <TableCell>
              <b>Wer fordert an?</b>
            </TableCell>
            <TableCell>
              <b>
                Wer will <b>zusätzlich</b> informiert werden?
              </b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.sieb}>
              <TableCell>{row.sieb}</TableCell>
              <TableCell>{row.who}</TableCell>
              <TableCell>{row.whoToInform}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Draw;
