const LOAD = 'search/LOAD';
const LOAD_SUCCESS = 'search/LOAD_SUCCESS';
const LOAD_FAIL = 'search/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loaded: false,
        loading: true,
        result: null,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        result: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        result: null,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState, query) {
  return globalState.search && globalState.search.loaded && globalState.search.result &&
    globalState.search.query === query;
}

export function load(query) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: async (client) => {
      if (query.length === 64) {
        try {
          const transaction = await client.get('/transactions/' + encodeURIComponent(query));
          return {
            type: 'transaction',
            resp: transaction,
          };
        } catch (err) {
          if (err.status < 400 || err.status >= 500) {
            throw err;
          }
        }
      }

      try {
        const block = await client.get('/blocks/' + encodeURIComponent(query));
        return {
          type: 'block',
          resp: block,
        };
      } catch (err) {
        if (err.status < 400 || err.status >= 500) {
          throw err;
        }
      }

      return {
        type: 'no_result'
      };
    }
  };
}
