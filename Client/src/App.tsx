/* eslint-disable react-hooks/exhaustive-deps */

import { AppBar, Button, Grid, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import {
  EntityTable,
  Evaluation,
  Info,
  InsertMask,
  PageNotFound
} from "./sites";
import { ApplicationState } from "./store";
import { dispatcher as IoDispatcher } from "./store/io";

function LC(props: { link: string }) {
  if (props.link !== "") return <Redirect to={props.link} />;
  return null;
}

function a11yProps(index: number) {
  return {
    id: `nav-${index}`,
    "aria-controls": `navtabs-${index}`
  };
}

function App() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { page, tabValue, referent, pageId } = useSelector(
    (state: ApplicationState) => {
      return {
        page: state.io.page,
        tabValue: state.io.tabValue,
        referent: state.io.referent,
        pageId: state.io.pageId
      };
    }
  );

  const [link, setLink] = useState<string>("");

  React.useEffect(() => {
    dispatcher.setReferent("Einkauf");
    console.log(document.URL);
    setLink(`/sieb/entities/5f44f958069d750700ca930c`);
  }, []);

  React.useEffect(() => {
    if (link !== "") setLink("");
  }, [link]);

  const onChangeTabs = (_: React.ChangeEvent<{}>, newValue: any) => {
    switch (newValue) {
      case 0:
        setLink(`/sieb/entities/5f44f958069d750700ca930c`);
        break;

      case 1:
        setLink(`/sieb/evaluation`);
        break;

      case 2:
        setLink(`/sieb/info`);
        break;

      default:
        setLink(`/sieb/entities/5f44f958069d750700ca930c`);
        break;
    }
    dispatcher.setTabValue(newValue);
    console.log(newValue);
  };

  return (
    <>
      <AppBar position="static" style={{ marginTop: 0, marginBottom: "2em" }}>
        <Tabs value={tabValue} onChange={onChangeTabs} aria-label="navtabs">
          <Tab label="Home" {...a11yProps(0)} />
          {/* <Tab label="Auswertung" {...a11yProps(1)} />
          <Tab label="Ansprechpartner" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <LC link={link} />

      <Grid container direction="column">
        <Switch>
          <Route
            exact
            path="/sieb/entities/:entityId"
            component={EntityTable}
          />
          <Route
            exact
            path="/sieb/entities/:entityId/insert"
            component={InsertMask}
          />

          <Route
            path="/sieb/entities/:entityId/insert/:objectId"
            component={InsertMask}
          />

          <Route path="/sieb/evaluation" component={Evaluation} />
          <Route path="/sieb/info" component={Info} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Grid>
    </>
  );
}

export default App;
