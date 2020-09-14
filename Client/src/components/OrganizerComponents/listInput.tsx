/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
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
import { ListPropCategory } from "../../model/interface";

function ListInput(props: {
  label: string;
  items: ListPropCategory[];
  setHandler(items: ListPropCategory[]): any;
}) {
  const [items, setItems] = useState<ListPropCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newCategpry, setNewCategory] = useState("");

  React.useEffect(() => {
    setItems(props.items);
  }, []);

  React.useEffect(() => {
    if (!items) return;
    props.setHandler(items);
  }, [items]);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    if (
      newItem === "" ||
      items.some(
        (i) => i.category === newCategpry && i.items.some((u) => u === newItem)
      )
    )
      return;

    const ncname = newCategpry === "" ? "none" : newCategpry;
    const cat = items.find((i) => i.category === ncname);

    if (cat) cat.items.push(newItem);
    else items.push({ category: ncname, items: [newItem] });

    setItems(items);

    setNewItem("");
    setNewCategory("");
    handleDialogClose();
  };

  return (
    <>
      <Typography variant="h6" component="span">
        {props.label}
      </Typography>
      <List>
        {items.map((item) => {
          return (
            <Box key={`${item.category}b`}>
              {item.category !== "none" ? (
                <ListItem key={item.category}>
                  <ListItemText primary={item.category} />
                </ListItem>
              ) : null}

              {item.items.map((it) => {
                return (
                  <ListItem key={`${item.category}_${it}`}>
                    <ListItemText primary={it} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          item.items = item.items.filter((fi) => fi !== it);
                          if (item.items.length === 0) {
                            const ne = items.filter(
                              (i) => i.category !== item.category
                            );
                            setItems([...ne]);
                          } else setItems([...items]);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </Box>
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
            label="Listenelement"
            onChange={(event) => {
              setNewItem(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") handleAdd();
            }}
          />

          <TextField
            margin="dense"
            fullWidth
            value={newCategpry}
            label="Kategorie"
            onChange={(event) => {
              setNewCategory(event.target.value);
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
