import {Container} from "inversify";
import {container} from "./index";

const bootstrap = (modules: Array<new(...args: any[]) => any>, container: Container) => {
  modules.forEach((module, i) => {
    container.bind(module).toSelf().inSingletonScope();
  });
};

const register = (identifier: symbol | string, ctor: new(...args: any[]) => any, container: Container) => {
  container.bind(identifier).to(ctor).inSingletonScope();
};

export {
  bootstrap,
  register
};
