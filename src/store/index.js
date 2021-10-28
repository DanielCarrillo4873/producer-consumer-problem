import { createStore } from 'vuex';
import { random } from 'lodash/number';

export default createStore({
  state: {
    buffer: [],
    max: 20,
    worker: null,
    simulationStarted: false,
    operationsList: [],
  },
  mutations: {
    insert(state, item) {
      state.buffer.push(item);
    },
    extract(state) {
      state.buffer.shift();
    },
    occupy(state, worker) {
      state.worker = worker;
    },
    free(state) {
      state.worker = null;
    },
  },
  getters: {
    occupied(state) {
      return state.worker !== null;
    },
    freeSpaces(state) {
      return state.max - state.buffer.length;
    },
    occupiedSpaces(state) {
      return state.buffer.length;
    },
    empty(state) {
      return state.buffer.length === 0;
    },
    full(state) {
      return state.buffer.length === state.max;
    },
  },
  actions: {
    useBuffer(context, worker) {
      return new Promise((resolve, reject) => {
        const time = random(1, 5) * 1000;
        setTimeout(() => {
          if (!context.getters.occupied) {
            if (worker === 'Producer' && context.getters.full) {
              reject();
            } else if (worker === 'Consumer' && context.getters.empty) {
              reject();
            } else {
              context.commit('occupy', worker);
              resolve();
            }
          } else {
            reject();
          }
        }, time);
      });
    },
    insertToBuffer(context, item) {
      return new Promise((resolve) => {
        const time = random(3, 6) * 1000;
        setTimeout(() => {
          context.commit('insert', item);
          resolve();
        }, time);
      });
    },
    extractFromBuffer(context) {
      return new Promise((resolve) => {
        const time = random(3, 6) * 1000;
        setTimeout(() => {
          const extracted = context.state.buffer[0];
          context.commit('extract');
          resolve(extracted);
        }, time);
      });
    },
  },
  modules: {},
  strict: true,
});
