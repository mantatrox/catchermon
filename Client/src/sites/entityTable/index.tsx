/* eslint-disable react-hooks/exhaustive-deps */

import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import { TableComponents } from "../../components";
import { EntityObject } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";
import {
  applyFilter,
  ChipData,
  conditionalRowStyle,
  filterTextOnKeyDown,
  filterTextOnKeyUp,
  processColumns,
  processData
} from "./handlers";

function RT(props: { link?: string }) {
  if (props.link && props.link !== "") return <Redirect to={props.link} />;
  return null;
}
const EntityTable = () => {
  const { entityId } = useParams();
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { entity, insertSuccess, referent } = useSelector(
    (state: ApplicationState) => {
      return {
        entity: state.io.entity,
        insertSuccess: state.io.insertSuccess,
        referent: state.io.referent
      };
    }
  );

  const [cols, setCols] = useState([] as any);
  const [data, setData] = useState([] as any);
  const [filtered, setFiltered] = useState([] as any);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState("");
  const [link, setLink] = useState("");

  const [chips, setChips] = useState<ChipData[]>([]);
  const [chipText, setChipText] = useState("");

  React.useEffect(() => {
    setLoading(true);
  }, []);

  React.useEffect(() => {
    dispatcher.getEntity(entityId);
  }, [entityId]);

  React.useEffect(() => {
    if (link !== "") setLink("");
  }, [link]);

  React.useEffect(() => {
    if (!entity) return;
    setCols(getColumns());
    const d = getData();
    setData(d);
    setFiltered(d);
  }, [entity]);

  React.useEffect(() => {
    if (insertSuccess) {
      dispatcher.setInsertSuccess(false);
      window.location.reload();
    }
  }, [insertSuccess]);

  React.useEffect(() => {
    setFiltered(applyFilter(chips, data, entity));
  }, [chips]);

  React.useEffect(() => {
    if (data.length > 0 && cols.length > 0) setLoading(false);
  }, [data, cols]);

  const getColumns = () => {
    if (!entity) return [];
    return processColumns(entity);
  };

  const getData = (): EntityObject[] => {
    if (!entity) return [];
    return processData(referent, entity);
  };

  return (
    <div className="container">
      <RT link={link} />
      <Grid container>
        <Grid item>
          <Button
            component={Link}
            to={`/sieb/entities/${entityId}/insert`}
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Hinzufügen
          </Button>
        </Grid>

        <Grid item style={{ width: "80%" }}>
          <TextField
            variant="outlined"
            size="small"
            label="Filter:"
            onChange={(event) => {
              setChipText(event.target.value);
            }}
            style={{
              width: "100%",
              marginLeft: "1em"
            }}
            value={chipText}
            onKeyUp={(event) => {
              const nc = filterTextOnKeyUp(event, chips, chipText);
              if (nc.length === chips.length) return;
              setChips(nc);
              setChipText("");
            }}
            onKeyDown={(event) => {
              const nc = filterTextOnKeyDown(event, chips, chipText);
              if (nc.length === chips.length) return;
              setChips(nc);
              setChipText("");
            }}
          />
          <Grid
            component="ul"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              width: "max-content"
            }}
            direction="row"
            container
          >
            {chips.map((chip) => {
              return (
                <Grid item component="li" key={chip.key}>
                  <Chip
                    style={{ margin: "0.5em" }}
                    label={chip.label}
                    onDelete={() => {
                      const nc = chips.filter((c) => c.key !== chip.key);
                      setChips(nc);
                    }}
                    size="small"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <DataTable
        title={entity?.label}
        columns={cols}
        data={filtered}
        highlightOnHover
        onRowClicked={(item: EntityObject) => {
          if (!item._id) return;
          setSelectedObjectId(item._id);
          setOpenDialog(true);
        }}
        keyField={"_id"}
        conditionalRowStyles={conditionalRowStyle(referent, entity)}
        progressPending={loading}
        progressComponent={<CircularProgress />}
        pagination={true}
        paginationComponentOptions={{
          rowsPerPageText: "Reihen pro Seite:"
        }}
        noDataComponent="Keine Daten vorhanden"
        dense
        paginationRowsPerPageOptions={[15, 20, 25, 30]}
        paginationPerPage={15}
      />
      <TableComponents.Simple
        entity={entity}
        open={openDialog}
        referent={referent}
        selectedObjectId={selectedObjectId}
        closeHandler={(state) => {
          setOpenDialog(state);
        }}
        deleteHandler={(objectId) => {
          dispatcher.remove(objectId, referent);
        }}
        editHandler={(objectId) => {
          if (!entity) return;
          setLink(`/sieb/entities/${entity._id}/insert/${objectId}`);
        }}
      />
    </div>
  );
};

export default EntityTable;
