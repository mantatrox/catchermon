/* eslint-disable react-hooks/exhaustive-deps */

import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import moment from "moment";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
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

function RT(props: { link?: string }) {
  if (props.link && props.link !== "") return <Redirect to={props.link} />;
  return null;
}

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

  interface ChipData {
    key: number;
    label: string;
  }

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
    if (chips.length === 0) {
      setFiltered(data);
      return;
    }
    const fProps = entity?.properties.filter(
      (p) => !entity.options.hiddenProperties.includes(p.name)
    );

    if (!fProps) {
      setFiltered(data);
      return;
    }

    let toFilter = [...data];

    for (const chip of chips) {
      toFilter = toFilter.filter((rowObject: any) => {
        return fProps
          .map((prop) => {
            return rowObject.properties[prop.name];
          })
          .some((value: string) =>
            value.toLowerCase().includes(chip.label.toLowerCase())
          );
      });
    }

    setFiltered(toFilter);
  }, [chips]);

  React.useEffect(() => {
    if (data.length > 0 && cols.length > 0) setLoading(false);
  }, [data, cols]);

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
      const basic = {
        name: item.label,
        selector: `properties.${item.name}`,
        sortable: true
      };
      switch (item.type) {
        case PropertyType.CheckboxProp:
          const cell = (row: EntityObject) => {
            const id = row._id;
            if (!id) return null;

            const obj = entity.items.find((i) => i._id === id);
            if (!obj) return null;
            const value = obj.properties.find((r) => r.propKey === item.name)
              ?.propValue;

            return value === "true" ? <CheckBox /> : <CheckBoxOutlineBlank />;
          };

          return { ...basic, cell };

        case PropertyType.DateProp:
          const sortFunction = (rowA: any, rowB: any) => {
            const tA = moment(rowA.properties[item.name], "DD.MM.YYYY").unix();
            const tB = moment(rowB.properties[item.name], "DD.MM.YYYY").unix();
            return tA - tB;
          };

          return { ...basic, sortFunction };

        default:
          return basic;
      }
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
            nP[prop.propKey] =
              prop.propValue === ""
                ? ""
                : moment(prop.propValue).format("DD.MM.YYYY");
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
      <RT link={link} />

      <Grid container>
        <Grid item xs={1}>
          <Button
            component={Link}
            to={`/sieb/entities/${entityId}/insert`}
            variant="contained"
          >
            +
          </Button>
        </Grid>

        <Grid item xs={11}>
          <Grid container direction="column">
            <Typography
              variant="h5"
              style={{
                marginRight: "0.2em",
                marginTop: "0.4em"
              }}
            >
              Filter:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              onChange={(event) => {
                setChipText(event.target.value);
              }}
              style={{
                width: "100%"
              }}
              value={chipText}
              onKeyUp={(event) => {
                const possibleKeys = ["Enter", "Tab", " ", "Backspace"];
                if (!possibleKeys.includes(event.key)) return;

                if (event.key === "Backspace" && chipText === "") {
                  const nc = chips.slice(0, chips.length - 1);
                  setChips(nc);
                  return;
                }

                const newChip = chipText.trim();
                if (newChip === "") return;

                const nc = [...chips];
                nc.push({ key: chips.length, label: newChip });

                setChips(nc);
                setChipText("");
              }}
            />
          </Grid>
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
        conditionalRowStyles={condStyle(referent, entity)}
        progressPending={loading}
        progressComponent={<CircularProgress />}
        pagination={true}
        paginationComponentOptions={{
          rowsPerPageText: "Reihen pro Seite:"
        }}
        noDataComponent="Keine Daten vorhanden"
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
          editHandler={(objectId) => {
            setLink(`/sieb/entities/${entity._id}/insert/${objectId}`);
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
