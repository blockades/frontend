const LOAD = 'transaction/LOAD';
const LOAD_SUCCESS = 'transaction/LOAD_SUCCESS';
const LOAD_FAIL = 'transaction/LOAD_FAIL';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        data: null,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        data: null,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState, hash) {
  return globalState.transac5ion && globalState.transac5ion.loaded && globalState.transac5ion.data &&
    globalState.transaction.data.hash === hash;
}

export function load(hash) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/transactions/' + hash)
  };
}
