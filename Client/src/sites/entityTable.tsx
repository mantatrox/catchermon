/* eslint-disable react-hooks/exhaustive-deps */

import { Button } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { TableComponents } from "../components";
import {
  DistributionStatus,
  Entity,
  EntityObject,
  EntityType,
  PropertyType
} from "../model/interface";
import { ApplicationState } from "../store";
import { dispatcher as IoDispatcher } from "../store/io";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";

const condStyle = (referent: string, entity?: Entity) => {
  if (!entity || !entity.options.useConditionalFormatting) return [];
  return [
    {
      when: (row: EntityObject) => row.referent === referent,
      style: {
        backgroundColor: "#ecffe6"
      }
    },
    {
      when: (row: EntityObject) => row.distribution?.referent === referent,
      style: {
        backgroundColor: "#ffffcc"
      }
    },
    {
      when: (row: EntityObject) =>
        row.referent === referent &&
        row.distribution?.status === DistributionStatus.BOOKED,
      style: {
        backgroundColor: "#ffe6cc"
      }
    }
  ];
};

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

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState("");

  React.useEffect(() => {
    dispatcher.getEntity(entityId);
  }, [entityId]);

  React.useEffect(() => {
    setCols(getColumns());
    setData(getData());
  }, [entity]);

  React.useEffect(() => {
    if (insertSuccess) {
      dispatcher.setInsertSuccess(false);
      window.location.reload();
    }
  }, [insertSuccess]);

  const getColumns = () => {
    if (!entity || !entity.options) return [];

    const filtered =
      entity.options.hiddenProperties.length > 0
        ? entity?.properties.filter(
            (p) =>
              entity.options &&
              !entity.options.hiddenProperties.includes(p.name)
          )
        : entity.properties;

    const props = filtered.map((item) => {
      if (item.type === PropertyType.CheckboxProp)
        return {
          name: item.label,
          sortable: true,
          cell: (row: EntityObject) => {
            const id = row._id;
            if (!id) return null;

            const obj = entity.items.find((i) => i._id === id);
            if (!obj) return null;
            const value = obj.properties.find((r) => r.propKey === item.name)
              ?.propValue;

            return value === "true" ? <CheckBox /> : <CheckBoxOutlineBlank />;
          }
        };
      return {
        name: item.label,
        selector: `properties.${item.name}`,
        sortable: true
      };
    });

    if (entity.options.showReferent)
      props.push({ name: "Referent", selector: "referent", sortable: true });

    return props;
  };

  const getData = (): EntityObject[] => {
    if (!entity) return [];
    const wi = entity.items
      .filter(
        (item) =>
          item.distribution?.status === DistributionStatus.REPORTED ||
          (item.distribution?.status === DistributionStatus.BOOKED &&
            (item.referent === referent ||
              item.distribution?.referent === referent))
      )
      .map((item) => ({ ...item }));

    try {
      const data = wi.map((item: EntityObject) => {
        const nP: any = {};
        const filtered = item.properties.filter(
          (p) =>
            entity.options &&
            !entity.options.hiddenProperties.includes(p.propKey)
        );
        for (const prop of filtered) {
          const def = entity.properties.find((pr) => pr.name === prop.propKey);
          if (!def) continue;
          if (def.type === PropertyType.DateProp) {
            nP[prop.propKey] = moment(prop.propValue).format("DD.MM.YYYY");
            continue;
          }
          let value = prop.propValue;
          if (value === undefined) continue;
          if (value.length > 20) value = value.slice(0, 17) + "...";
          nP[prop.propKey] = value;
        }
        item.properties = nP;
        item.insertDate = moment(item.insertDate).format("DD.MM.YYYY HH:mm");

        return item;
      });
      return data ? data : [];
    } catch (error) {
      console.log(error);
      return entity ? entity.items : [];
    }
  };

  return (
    <div className="container">
      <Button
        component={Link}
        to={`/entities/${entityId}/insert`}
        variant="contained"
      >
        +
      </Button>
      <DataTable
        title={entity?.label}
        columns={cols}
        data={data}
        highlightOnHover
        onRowClicked={(item: EntityObject) => {
          if (!item._id) return;
          setSelectedObjectId(item._id);
          setOpenDialog(true);
        }}
        keyField={"_id"}
        conditionalRowStyles={condStyle(referent, entity)}
      />

      {entity?.options.type === EntityType.SIMPLE ? (
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
        />
      ) : (
        <TableComponents.Redist
          entity={entity}
          open={openDialog}
          referent={referent}
          selectedObjectId={selectedObjectId}
          bookHandler={(objectId, referent) => {
            dispatcher.book(objectId, referent);
          }}
          closeHandler={(state) => {
            setOpenDialog(state);
          }}
          deleteHandler={(objectId) => {
            dispatcher.remove(objectId, referent);
          }}
          deliverHandler={(objectId, referent) => {
            dispatcher.deliver(objectId, referent);
          }}
          clearHandler={(objectId) => {
            dispatcher.clear(objectId, referent);
          }}
        />
      )}
    </div>
  );
};

export default EntityTable;
