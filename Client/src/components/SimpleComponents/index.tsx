import { IconButton } from "@material-ui/core";
import { Add, Delete, Visibility, VisibilityOff } from "@material-ui/icons";
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
    <IconButton edge="end" aria-label="delete" onClick={props.onClickHandler}>
      <Delete />
    </IconButton>
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

export default { AddButton, DeleteButton, VisibilityButton, Hider };
