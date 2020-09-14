/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Grid, MenuItem, Select } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import { TableComponents } from "../../components";
import { ChipData } from "../../components/TableComponents/Filter";
import api from "../../config/api.json";
import { EntityObject, EntityType } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";
import { conditionalRowStyle } from "./handlers";

function doSocketStuff(
  pageId: string,
  refreshHandler: (entityId: string) => void
) {
  const socket = io(api.socketServer, {
    path: "/catcher"
  });

  socket.on("connect", () => {
    socket.emit("join", pageId);
  });

  socket.on("refresh", refreshHandler);
}

const EntityTable = () => {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { entity, insertSuccess, referent, page } = useSelector(
    (state: ApplicationState) => {
      return {
        entity: state.io.entity,
        insertSuccess: state.io.insertSuccess,
        referent: state.io.referent,
        page: state.io.page
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

  const { entityId } = useParams<{ entityId: string }>();

  const cookies = new Cookies();

  React.useEffect(() => {
    const cookie = cookies.get("page");
    if (!cookie || cookie === "undefined") {
      history.push("/login");
      return;
    }

    setLoading(true);
    dispatcher.getData(cookie.pageId);
    dispatcher.setReferent(cookie.referent);
    dispatcher.clearEntity();
    dispatcher.setTabValue(0);

    doSocketStuff(cookie.pageId, (eid) => {
      if (entityId === eid) dispatcher.getEntity(eid);
    });
  }, []);

  React.useEffect(() => {
    if (entityId && page) {
      if (!page?.entities.some((e) => e._id === entityId)) {
        history.push("/not/found/");
        return;
      }
      dispatcher.getEntity(entityId);
    }
    setLoading(true);
  }, [entityId, page]);

  React.useEffect(() => {
    if (!entity) return;

    setCols(getColumns());
    const d = getData();
    setData(d);
    setFiltered(d);
    setLoading(false);
  }, [entity]);

  React.useEffect(() => {
    if (insertSuccess && entity?._id) {
      setOpenDialog(false);
      dispatcher.setInsertSuccess(false);
      dispatcher.getEntity(entity?._id);
      setLoading(true);
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
      <Select
        value={entity?._id}
        key={`select${entity?._id}`}
        style={{ margin: "1em" }}
        label="Entities"
        onChange={(event) => {
          const id = event.target.value as string;
          history.push(`/${id}`);
        }}
      >
        {page?.entities.map((entity) => {
          return (
            <MenuItem key={entity.label} value={entity._id}>
              {entity.label}
            </MenuItem>
          );
        })}
      </Select>
      <Grid container>
        <Grid item>
          <Button
            component={Link}
            to={`insert/${entity?._id}`}
            variant="contained"
            color="primary"
            startIcon={<Add />}
            disabled={!entity || loading}
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

      {entity?.options.type === EntityType.SIMPLE && (
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
            history.push(`insert/${entity._id}/${objectId}`);
          }}
        />
      )}

      {entity?.options.type === EntityType.REDISTRIBUTE && (
        <TableComponents.TDialog.Redist
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
          bookHandler={(objectId) => {
            dispatcher.book(objectId, referent);
          }}
          clearHandler={(objectId) => {
            dispatcher.clear(objectId, referent);
          }}
          deliverHandler={(objectId) => {
            dispatcher.deliver(objectId, referent);
          }}
        />
      )}
    </div>
  );
};

export default EntityTable;
