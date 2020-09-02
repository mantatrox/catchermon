import { CircularProgress } from "@material-ui/core";
import React from "react";
import DataTable, {
  IDataTableConditionalRowStyles
} from "react-data-table-component";
import { EntityObject } from "../../model/interface";

function Draw(props: {
  title?: string;
  columns?: any[];
  data?: any[];
  onRowClicked?(item: EntityObject): void;
  loading?: boolean;
  conditionalRowStyles?: IDataTableConditionalRowStyles<EntityObject>[];
  pagination?: boolean;
  toWrap?: boolean;
}) {
  let cols = props.columns ? props.columns : [];

  if (props.toWrap)
    cols = cols.map((col) => {
      return { ...cols, wrap: true };
    });

  const data = props.data ? props.data : [];
  const pagi =
    props.pagination === undefined || !props.pagination
      ? {}
      : {
          paginationRowsPerPageOptions: [15, 20, 25, 30],
          paginationPerPage: 15,
          pagination: true,
          paginationComponentOptions: {
            rowsPerPageText: "Reihen pro Seite:"
          }
        };

  return (
    <DataTable
      title={props.title}
      columns={cols}
      data={data}
      highlightOnHover
      onRowClicked={props.onRowClicked}
      keyField={"_id"}
      conditionalRowStyles={props.conditionalRowStyles}
      progressPending={props.loading}
      progressComponent={<CircularProgress />}
      noDataComponent="Keine Daten vorhanden"
      dense
      {...pagi}
    />
  );
}

export default Draw;
