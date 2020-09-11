/* eslint-disable react-hooks/exhaustive-deps */

import { AppBar, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import "./App.css";
import {
  EntityTable,
  InsertMask,
  Organizer,
  PageNotFound,
  Login
} from "./sites";
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
  const cookies = new Cookies();

  React.useEffect(() => {
    const cookie = cookies.get("page");
    if (cookie !== undefined && cookie !== "undefined") {
      dispatcher.setPageId(cookie.pageId);
      dispatcher.setReferent(cookie.referent);
    } else {
      history.push("/login");
    }
  }, []);

  const onChangeTabs = (_: React.ChangeEvent<{}>, newValue: any) => {
    switch (newValue) {
      case 0:
        dispatcher.clearEntity();
        history.push("/");
        break;

      case 1:
        dispatcher.clearEntity();
        history.push(`/organizer`);
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
          <Tab label="Organizer" />
        </Tabs>
      </AppBar>

      <Switch>
        <Route exact path={"/"} component={EntityTable} />

        <Route exact path={`/insert/:entityId`} component={InsertMask} />

        <Route
          exact
          path={`/insert/:entityId/:objectId`}
          component={InsertMask}
        />

        <Route exact path={`/organizer`} component={Organizer} />
        <Route exact path={`/login`} component={Login} />

        <Route exact path={"/:entityId"} component={EntityTable} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
}

export default App;
