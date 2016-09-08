const LOAD = 'block/LOAD';
const LOAD_SUCCESS = 'block/LOAD_SUCCESS';
const LOAD_FAIL = 'block/LOAD_FAIL';

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

export function isLoaded(globalState, id) {
  return globalState.block && globalState.block.loaded && globalState.block.data &&
    (globalState.block.data.hash === id || globalState.block.data.height === id);
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/blocks/' + id)
  };
}
