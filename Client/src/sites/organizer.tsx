/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import {
  OrganizerOption,
  SimpleComponents,
  Utils,
  OrganizerComponents
} from "../components";
import { Entity, PropertyType, Property } from "../model/interface";
import { DefaultEntity } from "../model/init";
import { propHandler } from "../modules";
import { ApplicationState } from "../store";
import { dispatcher as IoDispatcher } from "../store/io";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function visibilityHandler(
  entity: Entity,
  p: Property,
  setEntity: (entity: Entity) => void
) {
  if (!entity.options) return;
  const visible = !entity.options.hiddenProperties.some((e) => p.name === e);

  if (visible)
    setEntity({
      ...entity,
      options: {
        ...entity.options,
        hiddenProperties: [...entity.options.hiddenProperties, p.name]
      }
    });
  else
    setEntity({
      ...entity,
      options: {
        ...entity.options,
        hiddenProperties: entity.options.hiddenProperties.filter(
          (hp) => hp !== p.name
        )
      }
    });
}

function Organizer() {
  const { page, insertSuccess } = useSelector((state: ApplicationState) => {
    return {
      page: state.io.page,
      insertSuccess: state.io.insertSuccess
    };
  });

  const { pageId } = useParams();

  React.useEffect(() => {
    dispatcher.getData(pageId);
    dispatcher.setTabValue(1);
  }, []);

  React.useEffect(() => {
    if (page) setEntities(page.entities);
  }, [page]);

  React.useEffect(() => {
    if (insertSuccess) dispatcher.setInsertSuccess(false);
  }, [insertSuccess]);

  const classes = useStyles();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [entity, setEntity] = useState<Entity>(DefaultEntity);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEntityDialog, setOpenEntityDialog] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");
  const [newPropName, setNewPropName] = useState("");
  const [newType, setNewType] = useState("");
  const [toDelete, setToDelete] = useState("");

  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  function de() {
    return (
      <Grid container direction="row">
        <Utils.DrawEntities
          entities={entities}
          onchange={(event) => {
            const eid = event.target.value as string;
            const entity = entities.find((e) => e._id === eid);
            if (!entity) return;
            setEntity(entity);
          }}
        />
        <SimpleComponents.AddButton
          onClickHandler={() => {
            setOpenEntityDialog(true);
          }}
        />
      </Grid>
    );
  }

  function of() {
    if (entity && entity._id)
      return (
        <>
          <Grid container direction="column">
            <div className={classes.root}>
              <Tabs
                orientation="vertical"
                onChange={onTabChange}
                value={tabIndex}
                className={classes.tabs}
              >
                <Tab key="general" label="Allgemein" {...a11yProps(0)} />
                {entity.properties.map((p, i) => {
                  return (
                    <Tab key={p.name} label={p.label} {...a11yProps(i + 1)} />
                  );
                })}

                <SimpleComponents.AddButton
                  onClickHandler={() => {
                    setOpenAddDialog(true);
                  }}
                />
              </Tabs>

              <TabPanel index={0} value={tabIndex}>
                <OrganizerComponents.GeneralOptions entity={entity} />
                <OrganizerComponents.Expiration entity={entity} />
              </TabPanel>

              {entity.properties.map((p, i) => {
                if (!entity.options) return null;
                return (
                  <TabPanel value={tabIndex} index={i + 1}>
                    <OrganizerOption property={p} />
                    <SimpleComponents.VisibilityButton
                      hidden={entity.options.hiddenProperties.some(
                        (e) => p.name === e
                      )}
                      onClickHandler={() => {
                        visibilityHandler(entity, p, setEntity);
                      }}
                    />
                    <SimpleComponents.DeleteButton
                      onClickHandler={() => {
                        setToDelete(p.name);
                        setOpenDeleteDialog(true);
                      }}
                    />
                  </TabPanel>
                );
              })}
            </div>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatcher.updateEntity(entity, entity.properties);
              dispatcher.setTabValue(0);
            }}
            style={{ marginTop: "1em" }}
          >
            Speichern
          </Button>
        </>
      );
    return <></>;
  }

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleDeleteDialogClose = () => {
    setToDelete("");
    setOpenDeleteDialog(false);
  };

  const confirmDelete = () => {
    const np = entity.properties.filter((p) => p.name !== toDelete);
    entity.properties = np;
    handleDeleteDialogClose();
  };

  const handleAdd = () => {
    if (newPropName === "" || newType === "") return;

    const tType = newType as PropertyType;
    propHandler.createNewProp(entity, newPropName, tType);

    setNewPropName("");
    setNewType("");
    setOpenAddDialog(false);
    setTabIndex(entity.properties.length - 1);
  };

  const handleAddEntity = () => {
    if (newEntityName === "") return;
    dispatcher.createEntity(pageId, newEntityName);
  };

  function RT(props: { entityId?: string; insertSuccess: boolean }) {
    if (insertSuccess && props.entityId !== "")
      return <Redirect to={`/entities/${props.entityId}`} />;
    else return <div />;
  }

  return (
    <>
      <RT entityId={entity._id} insertSuccess={insertSuccess} />
      <Grid container direction="row" style={{ marginBottom: "2em" }}>
        {de()}
      </Grid>
      {of()}

      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Neues Element</DialogTitle>
        <DialogContent>
          <DialogContentText>ID und Typ für neue Eigenschaft</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={newPropName}
            onChange={(event) => {
              setNewPropName(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") handleAdd();
            }}
          />
          <InputLabel id="idLabel">Typ: </InputLabel>
          <Select
            labelId="idLabel"
            onChange={(event) => {
              setNewType(event.target.value as string);
            }}
          >
            <MenuItem value="list">Liste</MenuItem>
            <MenuItem value="text">Textfeld</MenuItem>
            <MenuItem value="check">Checkbox</MenuItem>
            <MenuItem value="number">Nummer</MenuItem>
            <MenuItem value="date">Datum</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleAdd} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Eigenschaft entfernen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Soll die Eigenschaft "{toDelete}" wirklich gelöscht werden?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Abbrechen
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEntityDialog}
        onClose={() => {
          setOpenEntityDialog(false);
        }}
      >
        <DialogTitle>Neue Entität</DialogTitle>
        <DialogContent>
          <DialogContentText>Eine neue Entität anlegen</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={newEntityName}
            onChange={(event) => {
              setNewEntityName(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === "Enter") handleAddEntity();
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenEntityDialog(false);
            }}
            color="primary"
          >
            Abbrechen
          </Button>
          <Button onClick={handleAddEntity} color="primary">
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Organizer;
