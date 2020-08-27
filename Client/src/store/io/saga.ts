import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { ApplicationState } from "..";
import {
  Entity,
  EntityObject,
  Page,
  PropertyType,
  StateReturn
} from "../../model/interface";
import { dataHandler } from "../../modules";
import { putError } from "../utils";
import actions from "./actions";
import { DispatchAction } from "./reducer";

interface MiniState {
  entity?: Entity;
  referent: string;
  solutions: StateReturn[];
}

const pages = {
  get: function* () {
    try {
      const e = yield call(dataHandler.pages.get);
      const pages = e as Page[];
      yield put({ type: actions.GetDataSuccess, payload: { pages } });
    } catch (error) {
      yield putError(actions.GetDataError, error);
    }
  },

  getOne: function* (action: DispatchAction) {
    try {
      if (!action.payload.pageId) throw new Error("No pageId");
      const data = yield call(dataHandler.pages.getOne, action.payload.pageId);
      const page: Page = data;
      yield put({ type: actions.GetPageSuccess, payload: { page } });
    } catch (error) {
      yield putError(actions.GetPageError, error);
    }
  }
};

const entities = {
  getOne: function* (action: DispatchAction) {
    try {
      const entityId = action.payload.entityId;
      if (!entityId) throw new Error("no entityId in saga");

      const e = yield call(dataHandler.entities.getOpen, entityId);
      yield put({
        type: actions.GetEntitySuccess,
        payload: { entity: e[0] as Entity }
      });
    } catch (error) {
      yield putError(actions.GetEntityError, error);
    }
  },

  update: function* (action: DispatchAction) {
    const ne = action.payload.newEntity;

    if (!ne) {
      yield putError(
        actions.UpdateEntityError,
        new Error("New Entity missing in update")
      );
      return;
    }

    const result = yield call(dataHandler.entities.update, ne);
    const response = result as Response;

    if (response.status === 204)
      yield put({ type: actions.UpdateEntitySuccess });
    else yield putError(actions.GetEntityError, response);
  },
  create: function* (action: DispatchAction) {
    const pageId = action.payload.pageId;
    const entityLabel = action.payload.entityLabel;

    if (!pageId || !entityLabel || pageId === "" || entityLabel === "") {
      yield putError(actions.CreateEntityError, new Error("creating failed"));
      return;
    }

    const result = yield call(dataHandler.entities.create, pageId, entityLabel);
    const response = result as Response;

    if (response.status === 204)
      yield put({ type: actions.CreateEntitySuccess });
    else yield putError(actions.CreateEntityError, response);
  }
};

const objects = {
  create: function* () {
    const getValues = (state: ApplicationState): MiniState => {
      return {
        entity: state.io.entity,
        referent: state.io.referent,
        solutions: state.io.solutions
      };
    };

    const mini: MiniState = yield select(getValues);
    const { entity, referent, solutions } = {
      entity: mini.entity,
      referent: mini.referent,
      solutions: mini.solutions
    };

    if (!entity || !entity._id || !solutions || solutions.length === 0) {
      yield putError(
        actions.CreateEntityError,
        new Error("creating object failed")
      );
      return;
    }

    try {
      const no: EntityObject = { referent, properties: [] };
      for (const p of entity.properties) {
        const found = solutions.find((s) => s.propName === p.name);
        if (!found && p.required) throw new Error("Missing property");
        if (!found) continue;

        switch (p.type) {
          case PropertyType.ListProp:
            no.properties.push({ propKey: p.name, propValue: found.values });
            break;

          default:
            no.properties.push({ propKey: p.name, propValue: found.values[0] });
            break;
        }
      }

      const result = yield call(dataHandler.objects.create, entity._id, no);
      const response = result as Response;

      if (response.status === 204) {
        yield put({ type: actions.CreateObjectSuccess });
        yield put({ type: actions.GetDataStart });
      } else yield putError(actions.CreateObjectError, response);
    } catch (error) {
      yield putError(actions.CreateEntityError, error);
    }
  },

  deliver: function* (action: DispatchAction) {
    const objectId = action.payload.objectId;
    const referent = action.payload.referent;

    if (!objectId || !referent) {
      yield putError(
        actions.DeliverError,
        new Error("delivering object failed")
      );
      return;
    }

    const result = yield call(dataHandler.objects.deliver, objectId, referent);
    const response = result as Response;

    if (response.status === 204) yield put({ type: actions.DeliverSuccess });
    else yield putError(actions.DeliverError, response);
  },

  book: function* (action: DispatchAction) {
    const objectId = action.payload.objectId;
    const referent = action.payload.referent;

    if (!objectId || !referent) {
      yield putError(actions.BookError, new Error("booking object failed"));
      return;
    }

    const result = yield call(dataHandler.objects.book, objectId, referent);
    const response = result as Response;

    if (response.status === 204) yield put({ type: actions.BookSuccess });
    else yield putError(actions.BookError, response);
  },

  clear: function* (action: DispatchAction) {
    const objectId = action.payload.objectId;
    const referent = action.payload.referent;

    if (!objectId || !referent) {
      yield putError(actions.ClearError, new Error("clearing object failed"));
      return;
    }

    const result = yield call(dataHandler.objects.clear, objectId, referent);
    const response = result as Response;

    if (response.status === 204) yield put({ type: actions.ClearSuccess });
    else yield putError(actions.ClearError, response);
  },

  remove: function* (action: DispatchAction) {
    const objectId = action.payload.objectId;
    const referent = action.payload.referent;

    if (!objectId || !referent) {
      yield putError(actions.RemoveError, new Error("removing object failed"));
      return;
    }

    const result = yield call(dataHandler.objects.remove, objectId, referent);
    const response = result as Response;

    if (response.status === 204) yield put({ type: actions.RemoveSuccess });
    else yield putError(actions.RemoveError, response);
  },

  update: function* (action: DispatchAction) {
    const entObj = action.payload.newObject;

    if (!entObj) {
      yield putError(actions.UpdateObjectError, new Error("No object given"));
      return;
    }

    const result = yield call(dataHandler.objects.update, entObj);
    const response = result as Response;

    if (response.status === 204)
      yield put({ type: actions.UpdateObjectSuccess });
    else yield putError(actions.UpdateObjectError, response);
  }
};

function* saga() {
  yield takeLatest(actions.GetDataStart, pages.get);
  yield takeLatest(actions.GetPageStart, pages.getOne);

  yield takeLatest(actions.GetEntityStart, entities.getOne);
  yield takeLatest(actions.UpdateEntityStart, entities.update);
  yield takeLatest(actions.CreateEntityStart, entities.create);

  yield takeLatest(actions.CreateObjectStart, objects.create);
  yield takeLatest(actions.DeliverStart, objects.deliver);
  yield takeLatest(actions.BookStart, objects.book);
  yield takeLatest(actions.RemoveStart, objects.remove);
  yield takeLatest(actions.ClearStart, objects.clear);
  yield takeLatest(actions.UpdateObjectStart, objects.update);
}

export default saga;
