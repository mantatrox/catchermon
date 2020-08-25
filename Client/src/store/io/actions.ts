enum actions {
  SetSolutions = "IO_SET_SOLUTIONS",
  SetInsertSuccess = "IO_SET_INSERTSUCCESS",
  SetNewProps = "IO_SET_NEW_PROPERTIES",
  SetTabValue = "IO_SET_TABVALUE",
  SetReferent = "IO_SET_REFERENT",
  SetPageId = "IO_SET_PAGE_ID",
  SetObjectId = "IO_SET_OBJECT_ID",

  GetDataStart = "IO_GET_DATA_START",
  GetDataSuccess = "IO_GET_DATA_SUCCESS",
  GetDataError = "IO_GET_DATA_ERROR",

  GetPageStart = "IO_GET_PAGE_START",
  GetPageSuccess = "IO_GET_PAGE_SUCCESS",
  GetPageError = "IO_GET_PAGE_ERROR",

  GetEntityStart = "IO_GET_ENTITY_START",
  GetEntitySuccess = "IO_GET_ENTITY_SUCCESS",
  GetEntityError = "IO_GET_ENTITY_ERROR",

  CreateObjectStart = "IO_CREATE_OBJECT_START",
  CreateObjectSuccess = "IO_CREATE_OBJECT_SUCCESS",
  CreateObjectError = "IO_CREATE_OBJECT_ERROR",

  UpdateEntityStart = "IO_UPDATE_ENTITY_START",
  UpdateEntitySuccess = "IO_UPDATE_ENTITY_SUCCESS",
  UpdateEntityError = "IO_UPDAET_ENTITY_ERROR",

  CreateEntityStart = "IO_CREATE_ENTITY_START",
  CreateEntitySuccess = "IO_CREATE_ENTITY_SUCCESS",
  CreateEntityError = "IO_CREATE_ENTITY_ERROR",

  DeliverStart = "IO_DELIVER_START",
  DeliverSuccess = "IO_DELIVER_SUCCESS",
  DeliverError = "IO_DELIVER_ERROR",

  BookStart = "IO_BOOK_START",
  BookSuccess = "IO_BOOK_SUCCESS",
  BookError = "IO_BOOK_ERROR",

  RemoveStart = "IO_REMOVE_START",
  RemoveSuccess = "IO_REMOVE_SUCCESS",
  RemoveError = "IO_REMOVE_ERROR",

  ClearStart = "IO_CLEAR_START",
  ClearSuccess = "IO_CLEAR_SUCCESS",
  ClearError = "IO_CLEAR_ERROR"
}

export default actions;
