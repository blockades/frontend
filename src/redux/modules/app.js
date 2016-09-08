const SET_SEARCH_QUERY = 'app/SET_SEARCH_QUERY';

const initialState = {
  searchQuery: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query
      };
    default:
      return state;
  }
}

export function setSearchQuery(query) {
  return {
    type: SET_SEARCH_QUERY,
    query
  };
}
