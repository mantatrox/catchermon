/* eslint-disable react-hooks/exhaustive-deps */

import { Button, FormControl, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { InsertComponent } from "../../components";
import { EntityObject } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";
import { check, getValue } from "./handlers";
import { Save } from "@material-ui/icons";

function RT(props: { entityId?: string }) {
  if (props.entityId && props.entityId !== "")
    return <Redirect to={`/sieb/entities/${props.entityId}`} />;
  else return <div />;
}

function InsertMask() {
  const { entityId, objectId } = useParams();

  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { entity, solutions, insertSuccess } = useSelector(
    (state: ApplicationState) => {
      return {
        entity: state.io.entity,
        solutions: state.io.solutions,
        insertSuccess: state.io.insertSuccess
      };
    }
  );

  const [redId, setRedId] = useState<string>("");
  const [obj, setObj] = useState<EntityObject | undefined>();

  React.useEffect(() => {
    if (objectId && obj?._id !== objectId) {
      const o = entity?.items.find((i) => i._id === objectId);
      if (o && obj !== o) setObj(o);
    }
  }, [objectId]);

  React.useEffect(() => {
    dispatcher.getEntity(entityId);
  }, [entityId]);

  React.useEffect(() => {
    if (insertSuccess) {
      dispatcher.setInsertSuccess(false);
      setRedId(entityId);
    }
  }, [insertSuccess]);

  const onClickHandler = () => {
    if (!entity) return;
    if (check(entity, solutions))
      if (obj === undefined) dispatcher.createObject();
      else {
        const tempo = { ...obj };
        tempo.properties = solutions.map((s) => {
          return { propKey: s.propName, propValue: s.values[0] };
        });
        dispatcher.updateObject(tempo);
      }
    else console.log("nöp");
  };

  return (
    <div className="container">
      <RT entityId={redId} />
      <h1>{entity?.label}</h1>
      <Grid container direction="column">
        {entity?.properties.map((p) => {
          return (
            <FormControl key={p.name} style={{ marginTop: "1em" }}>
              <InsertComponent
                property={p}
                solutions={solutions}
                setHandler={(solutions) => {
                  dispatcher.setSolutions(solutions);
                }}
                value={getValue(p, obj)}
              />
            </FormControl>
          );
        })}
      </Grid>
      <Button
        color={"primary"}
        variant={"contained"}
        style={{ marginTop: "1em" }}
        onClick={onClickHandler}
        startIcon={<Save />}
      >
        Speichern
      </Button>
    </div>
  );
}

export default InsertMask;
