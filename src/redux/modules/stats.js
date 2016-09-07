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
    promise: (client) =>
      client.get('/visualizations/stats_all_or_nor/alltime/num')
        .then((data) => {
          if (!data.data || !data.data[0]) {
            throw new Error('No data for stats');
          }
          return data.data[0];
        })
  };
}
