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
      const blocks = client.get('/visualizations/blocks_all_or_nor/month/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for blocks_all_or_nor');
          }

          data.data.forEach(pt => {
            pt.x *= 1000;
          });

          return data;
        });

      const transactions = client.get('/visualizations/transactions_all_or_nor/month/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data for transactions_all_or_nor');
          }

          data.data.forEach(pt => {
            pt.x *= 1000;
          });

          return data;
        });

      const opReturnBlocksVsBlocks = client.get('/visualizations/op_return_blocks_vs_blocks/alltime/percentage')
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

      return Promise.all([
        blocks,
        transactions,
        opReturnBlocksVsBlocks
      ]).then(dataArray => {
        return {
          blocks: dataArray[0],
          transactions: dataArray[1],
          opReturnBlocksVsBlocks: dataArray[2]
        };
      });
    }
  };
}
