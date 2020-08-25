import { Dispatch } from "redux";
import actions from "./actions";
import { DispatchAction } from "./reducer";
import { StateReturn, Property, Entity } from "../../model/interface";

export default function dispatcher(dispatch: Dispatch<DispatchAction>) {
  function getData(pageId = "") {
    const payload = pageId === "" ? {} : { pageId };
    const type = pageId === "" ? actions.GetDataStart : actions.GetPageStart;
    dispatch({ type, payload });
  }

  function getEntity(entityId: string) {
    dispatch({ type: actions.GetEntityStart, payload: { entityId } });
  }

  function setSolutions(solutions: StateReturn[]) {
    dispatch({ type: actions.SetSolutions, payload: { solutions } });
  }

  function createObject() {
    dispatch({ type: actions.CreateObjectStart, payload: {} });
  }

  function setInsertSuccess(insertSuccess: boolean) {
    dispatch({ type: actions.SetInsertSuccess, payload: { insertSuccess } });
  }

  function updateEntity(entity: Entity, newProps: Property[]) {
    const ne: Entity = { ...entity, properties: newProps };
    dispatch({
      type: actions.UpdateEntityStart,
      payload: { newEntity: { ...ne } }
    });
  }

  function setTabValue(tabValue: number) {
    dispatch({ type: actions.SetTabValue, payload: { tabValue } });
  }

  function setReferent(referent: string) {
    dispatch({ type: actions.SetReferent, payload: { referent } });
  }

  function setPageId(pageId: string) {
    dispatch({ type: actions.SetPageId, payload: { pageId } });
  }

  function setObjectId(objectId: string) {
    dispatch({ type: actions.SetObjectId, payload: { objectId } });
  }

  function book(objectId: string, referent: string) {
    dispatch({ type: actions.BookStart, payload: { objectId, referent } });
  }

  function deliver(objectId: string, referent: string) {
    dispatch({ type: actions.DeliverStart, payload: { objectId, referent } });
  }

  function remove(objectId: string, referent: string) {
    dispatch({ type: actions.RemoveStart, payload: { objectId, referent } });
  }

  function clear(objectId: string, referent: string) {
    dispatch({ type: actions.ClearStart, payload: { objectId, referent } });
  }

  function createEntity(pageId: string, entityLabel: string) {
    dispatch({
      type: actions.CreateEntityStart,
      payload: { pageId, entityLabel }
    });
  }

  return {
    getData,
    getEntity,
    setSolutions,
    createObject,
    setInsertSuccess,
    updateEntity,
    setTabValue,
    setReferent,
    setPageId,
    createEntity,
    setObjectId,
    deliver,
    book,
    remove,
    clear
  };
}
