import addGeneric from "./generic";
import addSessionAuth from "./sessionAuth";

const addMiddlewares = (app) => {
  addGeneric(app);
  addSessionAuth(app);
};

export default addMiddlewares;
