import React from "react";
import { dispatcher as IoDispatcher } from "../store/io";
import { useDispatch } from "react-redux";

function Draw() {
  const dispatch = useDispatch();
  const dispatcher = IoDispatcher(dispatch);

  React.useEffect(() => {
    dispatcher.setTabValue(1);
  }, []);
  return <h1>Auswertung</h1>;
}

export default Draw;
