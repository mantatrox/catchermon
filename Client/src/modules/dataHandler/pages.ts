import config from "../../config/api.json";
import { Page } from "../../model/interface";
import { getter } from "./utils";

const get = async () => {
  const url = `${config.baseUrl}/pages`;
  return await getter<Page[]>(url);
};

const getOne = async (pageId: string) => {
  const url = `${config.baseUrl}/pages/${pageId}`;
  return (await getter<Page[]>(url))[0];
};

export default { get, getOne };
