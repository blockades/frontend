const LOAD = 'charts/LOAD';
const LOAD_SUCCESS = 'charts/LOAD_SUCCESS';
const LOAD_FAIL = 'charts/LOAD_FAIL';

const SET_CROSSHAIR_VALUES = 'charts/SET_CROSSHAIR_VALUES';
const SET_PIE_VALUES = 'charts/SET_PIE_VALUES';

const initialState = {
  loaded: false,
  crosshairValues: {
    block: [],
    transaction: [],
    signal: [],
  },
  pieValues: {
    block: [{angle: 1}, {angle: 1}],
    transaction: [{angle: 1}, {angle: 1}],
    signal: [{angle: 1}, {angle: 1}],
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loaded: false,
        loading: true,
        data: null,
        period: null,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.result.data,
        period: action.result.period,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        data: null,
        period: null,
        error: action.error
      };
    case SET_CROSSHAIR_VALUES:
      return {
        ...state,
        crosshairValues: action.values
      };
    case SET_PIE_VALUES:
      return {
        ...state,
        pieValues: action.values
      };
    default:
      return state;
  }
}

export function isLoaded(globalState, period) {
  return globalState.charts && globalState.charts.loaded && globalState.charts.period === period;
}

export function setCrosshairValues(values) {
  return {
    type: SET_CROSSHAIR_VALUES,
    values
  };
}

export function setPieValues(values) {
  return {
    type: SET_PIE_VALUES,
    values
  };
}

export function load(period) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const blocks = client
        .get('/visualizations/blocks_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('API did not return any data for blocks_all_or_nor');
          }

          return data.data;
        });

      const transactions = client
        .get('/visualizations/transactions_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('API did not return any data for transactions_all_or_nor');
          }

          return data.data;
        });

      const signals = client
        .get('/visualizations/signals_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('API did not return any data for signals_all_or_nor');
          }

          return data.data;
        });

      // TODO make api return all this in only 1 request?
      return Promise.all([
        blocks,
        transactions,
        signals
      ]).then(dataArray => {
        return {
          data: {
            block: dataArray[0],
            transaction: dataArray[1],
            signal: dataArray[2],
          },
          period: period
        };
      });
    }
  };
}
