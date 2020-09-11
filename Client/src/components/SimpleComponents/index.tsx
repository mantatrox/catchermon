import { IconButton, Button } from "@material-ui/core";
import {
  Add,
  Delete,
  Visibility,
  VisibilityOff,
  Cancel,
  Edit
} from "@material-ui/icons";
import React from "react";

function AddButton(props: { onClickHandler(): void }) {
  return (
    <IconButton edge="end" aria-label="add" onClick={props.onClickHandler}>
      <Add />
    </IconButton>
  );
}

function DeleteButton(props: { onClickHandler(): void }) {
  return (
    <Button
      variant="contained"
      aria-label="delete"
      onClick={props.onClickHandler}
      startIcon={<Delete />}
    >
      Entfernen
    </Button>
  );
}

function AbortButton(props: { onClickHandler(): void }) {
  return (
    <Button
      variant="contained"
      aria-label="abort"
      color="secondary"
      onClick={props.onClickHandler}
      startIcon={<Cancel />}
    >
      Abbrechen
    </Button>
  );
}

function EditButton(props: { onClickHandler(): void }) {
  return (
    <Button
      variant="contained"
      aria-label="abort"
      color="primary"
      onClick={props.onClickHandler}
      startIcon={<Edit />}
    >
      Bearbeiten
    </Button>
  );
}

function VisibilityButton(props: { onClickHandler(): void; hidden: boolean }) {
  return (
    <IconButton
      edge="end"
      aria-label="visibility"
      onClick={props.onClickHandler}
    >
      {props.hidden ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );
}

function Hider(props: React.PropsWithChildren<{ hidden: boolean }>) {
  if (props.hidden) return null;
  return <div>{props.children}</div>;
}

export default {
  AddButton,
  DeleteButton,
  VisibilityButton,
  Hider,
  AbortButton,
  EditButton
};
