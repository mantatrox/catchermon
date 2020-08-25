/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Add, Delete } from "@material-ui/icons";
import React, { useState } from "react";

function ListInput(props: {
  label: string;
  items: string[];
  setHandler(items: string[]): any;
}) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");

  React.useEffect(() => {
    setItems(props.items);
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    if (newItem === "" || items.some((i) => i === newItem)) return;
    items.push(newItem);
    setItems(items);
    props.setHandler(items);
    setNewItem("");
    handleDialogClose();
  };

  return (
    <>
      <Typography variant="h6" component="span">
        {props.label}
      </Typography>
      <List>
        {items.map((i) => {
          return (
            <ListItem>
              <ListItemText primary={i} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    const ne = items.filter((u) => u !== i);
                    setItems(ne);
                    props.setHandler(ne);
                  }}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        <ListItem>
          <ListItemText primary="Hinzufügen" />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Add />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Neues Element</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte die Bezeichnung für ein neues Element der Liste angeben
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={newItem}
            onChange={(event) => {
              setNewItem(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") handleAdd();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleAdd} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListInput;
