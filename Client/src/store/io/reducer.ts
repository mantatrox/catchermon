import { Action, Reducer } from "redux";
import actions from "./actions";
import { Page, Entity, StateReturn } from "../../model/interface";

export interface ReducerState {
  page?: Page;
  pageId: string;
  pages: Page[];
  entityId: string;
  entity?: Entity;
  entityLabel: string;
  solutions: StateReturn[];
  referent: string;
  insertSuccess: boolean;
  newEntity?: Entity;
  tabValue: number;
  objectId: string;
}

const initialState: ReducerState = {
  entityId: "",
  solutions: [],
  referent: "",
  entityLabel: "",
  insertSuccess: false,
  tabValue: 0,
  pageId: "",
  pages: [],
  objectId: ""
};

export interface DispatchAction extends Action {
  payload: Partial<ReducerState>;
}

export const reducer: Reducer<ReducerState, DispatchAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actions.GetDataSuccess:
      return { ...state, pages: action.payload.pages || state.pages };

    case actions.GetPageSuccess:
      return { ...state, page: action.payload.page || state.page };

    case actions.GetEntitySuccess:
      return { ...state, entity: action.payload.entity };

    case actions.SetSolutions:
      return {
        ...state,
        solutions: action.payload.solutions || state.solutions
      };

    case actions.SetInsertSuccess:
      return {
        ...state,
        insertSuccess:
          action.payload.insertSuccess === undefined
            ? state.insertSuccess
            : action.payload.insertSuccess
      };

    case actions.CreateObjectSuccess:
      return { ...state, insertSuccess: true };

    case actions.UpdateEntitySuccess:
      return { ...state, insertSuccess: true };

    case actions.CreateEntitySuccess:
      return { ...state, insertSuccess: true };

    case actions.DeliverSuccess:
      return { ...state, insertSuccess: true };

    case actions.BookSuccess:
      return { ...state, insertSuccess: true };

    case actions.RemoveSuccess:
      return { ...state, insertSuccess: true };

    case actions.ClearSuccess:
      return { ...state, insertSuccess: true };

    case actions.SetTabValue:
      return { ...state, tabValue: action.payload.tabValue || 0 };

    case actions.SetReferent:
      return { ...state, referent: action.payload.referent || "" };

    case actions.SetPageId:
      return { ...state, pageId: action.payload.pageId || "" };

    default:
      return { ...state };
  }
};
