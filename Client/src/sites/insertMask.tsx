/* eslint-disable react-hooks/exhaustive-deps */

import Joi from "@hapi/joi";
import { Button, FormControl, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import { InsertComponent } from "../components";
import { PropertyType, EntityObject, Property } from "../model/interface";
import { ApplicationState } from "../store";
import { dispatcher as IoDispatcher } from "../store/io";

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
    if (check())
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

  const check = () => {
    if (!entity) return false;
    for (const p of entity.properties) {
      switch (p.type) {
        case PropertyType.ListProp:
          const schemaL = Joi.object({
            propName: Joi.string().required(),
            values: p.required
              ? Joi.array().items(Joi.string()).min(1).required()
              : Joi.array().items(Joi.string()).min(1)
          });

          const lp = solutions.find((s) => s.propName === p.name);
          const { error: errorL } = schemaL.validate(lp);
          if (errorL) {
            return false;
          }
          break;

        case PropertyType.TextProp:
          const schemaT = Joi.object({
            propName: p.required ? Joi.string().required() : Joi.string(),
            values: p.required
              ? Joi.array().items(Joi.string()).length(1).required()
              : Joi.array().items(Joi.string()).max(1)
          });

          const tp = solutions.find((s) => s.propName === p.name);
          const { error: errorT } = schemaT.validate(tp);
          if (errorT) {
            return false;
          }
          break;

        case PropertyType.NumberProp:
          const schemaN = Joi.object({
            propName: p.required ? Joi.string().required() : Joi.string(),
            values: p.required
              ? Joi.array().items(Joi.string()).length(1).required()
              : Joi.array().items(Joi.string()).max(1)
          });
          const np = solutions.find((s) => s.propName === p.name);
          const { error: errorN } = schemaN.validate(np);
          if (errorN) {
            return false;
          }
          break;

        case PropertyType.CheckboxProp:
          break;
        default:
          break;
      }
    }

    return true;
  };

  function getValue(prop: Property, obj?: EntityObject) {
    try {
      if (obj === undefined) return undefined;
      const entProp = obj.properties.find((o) => o.propKey === prop.name);
      if (entProp === undefined) return undefined;
      const v = entProp.propValue.toString();
      return v;
    } catch (error) {
      console.log(error);
      console.log(prop.name);
      return undefined;
    }
  }

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
      >
        Speichern
      </Button>
    </div>
  );
}

export default InsertMask;
