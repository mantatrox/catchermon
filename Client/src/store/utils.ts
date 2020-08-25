import { put, call } from "redux-saga/effects";

export function* putError(errorAction: unknown, errorObject: unknown) {
  console.log(errorObject);
  yield put({ type: errorAction, payload: {} });
}

export function* getSaga<T>(
  errorAction: unknown,
  method: () => any,
  args?: []
) {
  try {
    const e = args ? yield call(method, ...args) : yield call(method);
    return e as T;
  } catch (error) {
    yield putError(errorAction, error);
  }
}
