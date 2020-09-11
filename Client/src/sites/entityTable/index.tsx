/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Grid } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { TableComponents } from "../../components";
import { ChipData } from "../../components/TableComponents/Filter";
import entitiesConfig from "../../config/entities.json";
import { EntityObject } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";
import { conditionalRowStyle } from "./handlers";

const EntityTable = () => {
  const entityId = entitiesConfig.siebe;

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

  const history = useHistory();

  const [cols, setCols] = useState([] as any);
  const [data, setData] = useState([] as any);
  const [filtered, setFiltered] = useState([] as any);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState("");

  const [chips, setChips] = useState<ChipData[]>([]);

  React.useEffect(() => {
    setLoading(true);
    dispatcher.clearEntity();
    dispatcher.getEntity(entityId);
    dispatcher.setTabValue(0);
  }, []);

  React.useEffect(() => {
    if (!entity) return;
    setCols(getColumns());
    const d = getData();
    setData(d);
    setFiltered(d);
    setLoading(false);
  }, [entity]);

  React.useEffect(() => {
    if (insertSuccess) {
      dispatcher.setInsertSuccess(false);
      window.location.reload();
    }
  }, [insertSuccess]);

  React.useEffect(() => {
    setFiltered(TableComponents.Utils.applyFilter(chips, data, entity));
  }, [chips]);

  const getColumns = () => {
    if (!entity) return [];
    return TableComponents.Utils.processColumns(entity);
  };

  const getData = (): EntityObject[] => {
    if (!entity) return [];
    return TableComponents.Utils.processData(referent, entity);
  };

  return (
    <div className="container">
      <Grid container>
        <Grid item>
          <Button
            component={Link}
            to={`insert/${entityId}`}
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            Hinzufügen
          </Button>
        </Grid>

        <Grid item style={{ width: "80%" }}>
          <TableComponents.Filter chips={chips} setChips={setChips} />
        </Grid>
      </Grid>

      <TableComponents.TTable
        columns={cols}
        data={filtered}
        loading={loading}
        onRowClicked={(item: EntityObject) => {
          if (!item._id) return;
          setSelectedObjectId(item._id);
          setOpenDialog(true);
        }}
        title={entity?.label}
        conditionalRowStyles={conditionalRowStyle(referent, entity)}
        pagination
      />

      <TableComponents.TDialog.Simple
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
          history.push(`insert/${entityId}/${objectId}`);
        }}
      />
    </div>
  );
};

export default EntityTable;
