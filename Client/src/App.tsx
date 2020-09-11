/* eslint-disable react-hooks/exhaustive-deps */

import { AppBar, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { EntityTable, InsertMask, Organizer, PageNotFound } from "./sites";
import { ApplicationState } from "./store";
import { dispatcher as IoDispatcher } from "./store/io";

function App() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const { tabValue } = useSelector((state: ApplicationState) => {
    return {
      tabValue: state.io.tabValue
    };
  });

  const history = useHistory();

  React.useEffect(() => {
    dispatcher.setReferent("Einkauf");
  }, []);

  const onChangeTabs = (_: React.ChangeEvent<{}>, newValue: any) => {
    switch (newValue) {
      case 0:
        dispatcher.clearEntity();
        history.push("/");
        break;

      case 1:
        dispatcher.clearEntity();
        history.push(`/sieb/evaluation`);
        break;

      case 2:
        dispatcher.clearEntity();
        history.push(`/sieb/contacts`);
        break;

      case 3:
        dispatcher.clearEntity();
        history.push(`/sieb/guide`);
        break;

      default:
        dispatcher.clearEntity();
        history.push("/");
        break;
    }
    dispatcher.setTabValue(newValue);
  };

  return (
    <>
      <AppBar position="static" style={{ marginTop: 0, marginBottom: "2em" }}>
        <Tabs value={tabValue} onChange={onChangeTabs}>
          <Tab label="Home" />
          <Tab label="Auswertung" />
          <Tab label="Ansprechpartner" />
          <Tab label="Anleitung" />
        </Tabs>
      </AppBar>

      <Switch>
        <Route exact path={"/"} component={EntityTable} />

        <Route exact path={`/insert/:entityId`}>
          <InsertMask backUrl="/" />
        </Route>

        <Route exact path={`/insert/:entityId/:objectId`}>
          <InsertMask backUrl="/" />
        </Route>

        <Route path={`/organizer`} component={Organizer} />

        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
}

export default App;
