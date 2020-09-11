/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { Page } from "../../model/interface";
import { ApplicationState } from "../../store";
import { dispatcher as IoDispatcher } from "../../store/io";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
);

const DrawReferents = (props: {
  pageId: string;
  pages: Page[];
  setHandler(value: string): void;
}) => {
  const classes = useStyles();

  if (props.pageId === "") return <div />;
  const page = props.pages.find((p) => p._id === props.pageId);
  if (!page) return <div />;

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="refLabel">{page.referent.label}</InputLabel>
      <Select
        labelId="refLabel"
        onChange={(event) => {
          props.setHandler(event.target.value as string);
        }}
      >
        {page.referent.items.map((item) => {
          return <MenuItem value={item}>{item}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

function LoginPage() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  const history = useHistory();

  const { pages } = useSelector((state: ApplicationState) => {
    return { pages: state.io.pages };
  });

  const [pageId, setPageId] = useState("");
  const [referent, setReferent] = useState("");

  React.useEffect(() => {
    dispatcher.getData();
  }, []);

  const classes = useStyles();

  return (
    <Grid container>
      <FormControl className={classes.formControl}>
        <InputLabel id="pagesLabel">Seiten</InputLabel>
        <Select
          labelId="pagesLabel"
          onChange={(event) => {
            setPageId(event.target.value as string);
          }}
        >
          {pages.map((p) => {
            return (
              <MenuItem value={p._id} key={p._id}>
                {p.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <DrawReferents
        pageId={pageId}
        pages={pages}
        setHandler={(referent) => {
          setReferent(referent);
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (referent === "" || pageId === "") return;
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          const cookies = new Cookies();
          cookies.set(
            "page",
            { pageId, referent },
            { path: "/", expires: oneYearFromNow }
          );

          console.log(pageId);
          dispatcher.setReferent(referent);
          dispatcher.setPageId(pageId);
          history.push("/");
        }}
      >
        Login
      </Button>
    </Grid>
  );
}

export default LoginPage;
