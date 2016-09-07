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
  return globalState.blocks && globalState.blocks.loaded;
}

export function load() {
  // const ptComparatorAsc = (a, b) => {
  //   if (a.x < b.x) {
  //     return 1;
  //   } else if (a.x > b.x) {
  //     return -1;
  //   }
  //   return 0;
  // };

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const blocks = client
        .get('/visualizations/blocks_all_or_nor/month/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for blocks_all_or_nor');
          }

          data.data.forEach(pt => {
            pt.x *= 1000;
          });

          return data;
        });

      const transactions = client
        .get('/visualizations/transactions_all_or_nor/month/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for transactions_all_or_nor');
          }

          data.data.forEach(pt => {
            pt.x *= 1000;
          });

          return data;
        });

      const signals = client
        .get('/visualizations/signals_all_or_nor/month/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for signals_all_or_nor');
          }

          data.data.forEach(pt => {
            pt.x *= 1000;
          });

          return data;
        });

      const opReturnBlocksVsBlocks = client
        .get('/visualizations/op_return_blocks_vs_blocks/alltime/percentage')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for op_return_blocks_vs_blocks');
          }

          const dataPoints = data.data;
          dataPoints[0].x = 10000; // mock

          dataPoints.push({
            x: dataPoints[0].y - dataPoints[0].x,
            y: dataPoints[0].y
          });

          return data;
        });

      const opReturnTransactionsVsTransactions = client
        .get('/visualizations/op_return_transactions_vs_transactions/alltime/percentage')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for op_return_transactions_vs_transactions');
          }

          const dataPoints = data.data;
          dataPoints[0].x = 10000; // mock

          dataPoints.push({
            x: dataPoints[0].y - dataPoints[0].x,
            y: dataPoints[0].y
          });

          return data;
        });

      const opReturnSignalsVsSignals = client
        .get('/visualizations/op_return_signals_vs_signals/alltime/percentage')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for op_return_signals_vs_signals');
          }

          const dataPoints = data.data;
          dataPoints[0].x = 10000; // mock

          dataPoints.push({
            x: dataPoints[0].y - dataPoints[0].x,
            y: dataPoints[0].y
          });

          return data;
        });

      // TODO make api return all this in only 1 request?
      return Promise.all([
        blocks,
        transactions,
        signals,
        opReturnBlocksVsBlocks,
        opReturnTransactionsVsTransactions,
        opReturnSignalsVsSignals
      ]).then(dataArray => {
        return {
          blocks: dataArray[0],
          transactions: dataArray[1],
          signals: dataArray[2],
          opReturnBlocksVsBlocks: dataArray[3],
          opReturnTransactionsVsTransactions: dataArray[4],
          opReturnSignalsVsSignals: dataArray[5],
        };
      });
    }
  };
}
