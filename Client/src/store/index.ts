import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import * as io from "./io";
import { all, fork } from "redux-saga/effects";

export interface ApplicationState {
  io: io.InitialState;
}

const rootSaga = function* root() {
  yield all([fork(io.saga)]);
};

const composeEnhancer =
  (process.env.NODE_ENV !== "production" &&
    (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) ||
  compose;

const sagaMiddleware = createSagaMiddleware();

const mainReducer = combineReducers<ApplicationState>({
  io: io.reducer
});

export const appStore = createStore(
  mainReducer,
  {},
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
