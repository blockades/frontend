const LOAD = 'stats/LOAD';
const LOAD_SUCCESS = 'stats/LOAD_SUCCESS';
const LOAD_FAIL = 'stats/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.stats && globalState.stats.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => {
      return Promise.resolve({
        data: {
          averageBlocksPerDay: Math.random() * 100,
          averageBlocksPerMonth: Math.random() * 100,
          averageOpReturnBlocksPerDay: Math.random() * 100,
          averageOpReturnBlocksPerMonth: Math.random() * 100,
          averageNonOpReturnBlocksPerDay: Math.random() * 100,
          averageNonOpReturnBlocksPerMonth: Math.random() * 100,

          averageTransactionsPerDay: Math.random() * 100,
          averageTransactionsPerMonth: Math.random() * 100,
          averageOpReturnTransactionsPerDay: Math.random() * 100,
          averageOpReturnTransactionsPerMonth: Math.random() * 100,
          averageNonOpReturnTransactionsPerDay: Math.random() * 100,
          averageNonOpReturnTransactionsPerMonth: Math.random() * 100,

          averageSignalsPerDay: Math.random() * 100,
          averageSignalsPerMonth: Math.random() * 100,
          averageOpReturnSignalsPerDay: Math.random() * 100,
          averageOpReturnSignalsPerMonth: Math.random() * 100,
          averageNonOpReturnSignalsPerDay: Math.random() * 100,
          averageNonOpReturnSignalsPerMonth: Math.random() * 100,
        }
      });
      // client.get('/visualizations/stats/alltime/num') // TODO
      //   .then((data) => {
      //     if (!data.data) {
      //       throw new Error('No data for stats');
      //     }
      //     return data;
      //   });
    }
  };
}
