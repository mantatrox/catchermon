import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import {
  DistributionStatus,
  Entity,
  PropertyType,
  EntityObject
} from "../../model/interface";
import { SimpleComponents } from "../index";
import { Redirect } from "react-router-dom";

const DrawProps = (props: { item: string; entity?: Entity }) => {
  if (!props.entity || props.item === "") return <div />;

  return (
    <>
      {props.entity.properties.map((property) => {
        const obj = props.entity?.items.find((i) => i._id === props.item);
        if (!obj) return null;
        let value = obj.properties.find((p) => p.propKey === property.name)
          ?.propValue;

        let content: JSX.Element;

        switch (property.type) {
          case PropertyType.DateProp:
            content = <div>{moment(value).format("DD.MM.yyyy")}</div>;
            break;
          case PropertyType.CheckboxProp:
            content =
              value === "true" ? <CheckBox /> : <CheckBoxOutlineBlank />;
            break;

          default:
            content = <div>{value}</div>;
        }

        return (
          <Grid container direction="row" key={property.name}>
            <Grid item xs={4}>
              <Typography style={{ fontWeight: "bold" }} component="span">
                {property.label}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {content}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

const Simple = (props: {
  entity?: Entity;
  selectedObjectId: string;
  referent: string;
  open: boolean;
  closeHandler(state: boolean): void;
  deleteHandler(objectId: string): void;
  editHandler(objectId: string): void;
}) => {
  if (!props.entity) return null;
  const obj = props.entity.items.find((i) => i._id === props.selectedObjectId);
  const content = (
    <Grid container>
      <DrawProps entity={props.entity} item={props.selectedObjectId} />
    </Grid>
  );
  if (!obj) return null;
  const actions =
    obj.referent === props.referent ? (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.editHandler(props.selectedObjectId);
          }}
        >
          Bearbeiten
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            props.closeHandler(false);
          }}
        >
          Abbrechen
        </Button>
        <SimpleComponents.DeleteButton
          onClickHandler={() => {
            props.deleteHandler(props.selectedObjectId);
          }}
        />
      </>
    ) : (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          props.closeHandler(false);
        }}
      >
        Abbrechen
      </Button>
    );

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogTitle>Daten</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

const Redist = (props: {
  entity?: Entity;
  selectedObjectId: string;
  referent: string;
  open: boolean;
  closeHandler(state: boolean): void;
  bookHandler(objectId: string, referent: string): void;
  deliverHandler(objectId: string, referent: string): void;
  deleteHandler(objectId: string): void;
  clearHandler(objectId: string): void;
}) => {
  if (!props.entity) return null;
  const obj = props.entity.items.find((i) => i._id === props.selectedObjectId);
  let title: string;
  let content: JSX.Element;
  let actions: JSX.Element;

  content = (
    <Grid container>
      <DrawProps entity={props.entity} item={props.selectedObjectId} />
    </Grid>
  );

  switch (obj?.distribution?.status) {
    case DistributionStatus.BOOKED:
      title = "Reservierung";
      actions = (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              props.closeHandler(false);
            }}
          >
            Abbrechen
          </Button>
          <SimpleComponents.DeleteButton
            onClickHandler={() => {
              props.clearHandler(props.selectedObjectId);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.deliverHandler(props.selectedObjectId, props.referent);
            }}
          >
            Bestätigen
          </Button>
        </>
      );
      content = (
        <Grid container>
          <DrawProps entity={props.entity} item={props.selectedObjectId} />
          <Grid item xs={4}>
            <Typography style={{ fontWeight: "bold" }} component="span">
              Reserviert durch:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {obj.distribution.referent}
          </Grid>
        </Grid>
      );
      break;

    case DistributionStatus.REPORTED:
      title = "Meldung";
      if (obj.referent === props.referent) {
        actions = (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.closeHandler(false);
              }}
            >
              Abbrechen
            </Button>
            <SimpleComponents.DeleteButton
              onClickHandler={() => {
                props.deleteHandler(props.selectedObjectId);
              }}
            />
          </>
        );
      } else {
        actions = (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.closeHandler(false);
              }}
            >
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                props.bookHandler(props.selectedObjectId, props.referent);
              }}
            >
              Reservieren
            </Button>
          </>
        );
      }
      break;

    default:
      title = "";
      actions = <div />;
      content = <div />;
  }

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default { Redist, Simple };
