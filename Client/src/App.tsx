/* eslint-disable react-hooks/exhaustive-deps */

import {
  AppBar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Cookies from "universal-cookie";
import "./App.css";
import { Entity } from "./model/interface";
import {
  EntityTable,
  InsertMask,
  LoginPage,
  Organizer,
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

function LoginButton(props: { referent: string; onClickHandler(): void }) {
  if (props.referent === "") return <div />;

  return (
    <>
      <Typography
        style={{
          marginTop: "12px",
          marginLeft: "auto",
          marginRight: "1em"
        }}
        component="span"
      >
        Eingeloggt als: {props.referent}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={props.onClickHandler}
      >
        Ausloggen
      </Button>
    </>
  );
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
  const [entities, setEntities] = useState<Entity[]>([]);

  const cookies = new Cookies();

  React.useEffect(() => {
    const cookie = cookies.get("page");
    if (cookie !== undefined && cookie !== "undefined") {
      dispatcher.setPageId(cookie.pageId);
      dispatcher.setReferent(cookie.referent);
    } else {
      setLink("/login");
    }
  }, []);

  React.useEffect(() => {
    if (!pageId || pageId === "") return;
    dispatcher.getData(pageId);
  }, [pageId]);

  React.useEffect(() => {
    if (page) {
      setEntities(page.entities);
    }
  }, [page]);

  React.useEffect(() => {
    if (link !== "") setLink("");
  }, [link]);

  const onChangeTabs = (event: React.ChangeEvent<{}>, newValue: any) => {
    switch (newValue) {
      case 0:
        setLink(`/`);
        break;

      case 1:
        if (!page) break;
        setLink(`/organizer/${page._id}`);
        break;

      default:
        setLink(`/`);
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
          <Tab label="Organizer" {...a11yProps(1)} />
          <LoginButton
            referent={referent}
            onClickHandler={() => {
              const cookies = new Cookies();
              cookies.remove("page");
              dispatcher.setReferent("");
              setLink("/login");
            }}
          />
        </Tabs>
      </AppBar>
      <LC link={link} />

      <Grid container direction="column">
        <Switch>
          <Route exact path="/">
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              {entities.map((e) => {
                return (
                  <Card key={e._id}>
                    <CardActionArea
                      onClick={() => {
                        setLink(`/entities/${e._id}`);
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" component="h2">
                          {e.label}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Grid>
          </Route>
          <Route exact path="/entities/:entityId" component={EntityTable} />
          <Route
            exact
            path="/entities/:entityId/insert"
            component={InsertMask}
          />
          <Route path="/organizer/:pageId" component={Organizer} />
          <Route path="/login" component={LoginPage} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Grid>
    </>
  );
}

export default App;
