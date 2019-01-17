import {Container} from "inversify";

const bootstrap = (modules: { new(...args: any[]): any }[], container: Container) => {
  modules.forEach(module => {
    container.bind(module).toSelf().inSingletonScope();
  });
};

export {
  bootstrap
}
