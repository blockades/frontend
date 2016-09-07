// import moment from 'moment';

const LOAD = 'blocks/LOAD';
const LOAD_SUCCESS = 'blocks/LOAD_SUCCESS';
const LOAD_FAIL = 'blocks/LOAD_FAIL';

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
        data: action.result.data,
        period: action.result.period,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        period: null,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.blocks && globalState.blocks.loaded;
}

export function load(period) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const blocks = client
        .get('/visualizations/blocks_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for blocks_all_or_nor');
          }

          const dataPoints = data.data
            .filter((pt, index) => index < 10);

          return dataPoints;
        });

      const transactions = client
        .get('/visualizations/transactions_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for transactions_all_or_nor');
          }

          const dataPoints = data.data
            .filter((pt, index) => index < 10);

          return dataPoints;
        });

      const signals = client
        .get('/visualizations/signals_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for signals_all_or_nor');
          }

          const dataPoints = data.data
            .filter((pt, index) => index < 10);

          return dataPoints;
        });

      // TODO make api return all this in only 1 request?
      return Promise.all([
        blocks,
        transactions,
        signals
      ]).then(dataArray => {
        return {
          data: {
            blocks: dataArray[0],
            transactions: dataArray[1],
            signals: dataArray[2],
          },
          period: period
        };
      });
    }
  };
}
