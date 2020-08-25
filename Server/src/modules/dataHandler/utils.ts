import { v4 } from "uuid";
import { sha256 } from "js-sha256";
import { database } from "../index";
import configGetter from "../../config";
// import { User } from "../../model/";

const config = configGetter();

const hashPass = (password: string, salt = v4()) => {
  const npw = `${password}${salt}`;
  const hash = sha256(npw);
  return { hash, salt };
};

const db = new database.MC({
  host: config.host,
  password: config.password,
  user: config.user,
  needsAuthentication: config.needsAuthentication
});

// const verifyLogin = async (user: User) => {
//   const u = await dataHandler.getUser(user.login, true);
//   if (u == null || !u.salt || !u.hash) return false;

//   const { hash } = hashPass(user.password, u.salt);
//   return hash == u.hash;
// };

export { hashPass, db, config };
