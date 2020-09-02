/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { TableComponents } from "../../components";
import entitiesConfig from "../../config/entities.json";
import { EntityObject } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";

function Draw() {
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

  const entityId = entitiesConfig.contacts;
  const history = useHistory();

  const [cols, setCols] = useState([] as any);
  const [data, setData] = useState([] as any);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState("");

  React.useEffect(() => {
    setLoading(true);
    dispatcher.getEntity(entityId);
    dispatcher.setTabValue(2);
  }, []);

  React.useEffect(() => {
    if (!entity) return;
    setCols(getColumns());
    const d = getData();
    setData(d);
    setLoading(false);
  }, [entity]);

  React.useEffect(() => {
    if (insertSuccess) {
      dispatcher.setInsertSuccess(false);
      window.location.reload();
    }
  }, [insertSuccess]);

  const getColumns = () => {
    if (!entity) return [];
    return TableComponents.Utils.processColumns(entity);
  };

  const getData = (): EntityObject[] => {
    if (!entity) return [];
    return TableComponents.Utils.processData(referent, entity);
  };

  return (
    <Box style={{ margin: "2em" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => history.push(`contacts/insert/${entityId}`)}
      >
        Hinzufügen
      </Button>
      <TableComponents.TTable
        columns={cols}
        data={data}
        loading={loading}
        title={entity?.label}
        onRowClicked={(item: EntityObject) => {
          if (!item._id) return;
          setSelectedObjectId(item._id);
          setOpenDialog(true);
        }}
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
          history.push(`contacts/insert/${entityId}/${objectId}`);
        }}
      />
    </Box>
  );
}

export default Draw;
