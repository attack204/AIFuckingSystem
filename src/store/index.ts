import { createStore } from 'vuex';
import modules, { StoreState } from './modules';

const store = () => createStore<StoreState>({
  modules,
});

export default store;
export { StoreState };
export * as MutationTypes from './mutation-types';
