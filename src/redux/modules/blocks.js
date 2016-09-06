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
  const toMonthTs = (ts) => {
    const date = new Date(ts);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
  };

  const ptComparatorAsc = (a, b) => {
    if (a.x < b.x) {
      return 1;
    } else if (a.x > b.x) {
      return -1;
    }
    return 0;
  };

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      const blocksPerDay = client.get('/visualizations/blocks/day/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data');
          }

          const yByX = {};
          data.data.forEach((point) => {
            const ptX = toMonthTs(point.x * 1000);
            yByX[ptX] = (yByX[ptX] || 0) + point.y;
          });
          data.data = Object.entries(yByX)
            .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
            .sort(ptComparatorAsc);
          return data;
        });

      const opReturnBlocksPerDay = client.get('/visualizations/op_return_blocks/day/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data');
          }

          const yByX = {};
          data.data.forEach((point) => {
            const ptX = toMonthTs(point.x * 1000);
            yByX[ptX] = (yByX[ptX] || 0) + point.y;
          });
          data.data = Object.entries(yByX)
            .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
            .sort(ptComparatorAsc);
          return data;
        });

      const transactionsPerBlockPerDay = client.get('/visualizations/transactions_per_block/day/num')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data');
          }

          const yByX = {};
          data.data.forEach((point) => {
            const ptX = toMonthTs(point.x * 1000);
            yByX[ptX] = (yByX[ptX] || 0) + point.y;
          });
          data.data = Object.entries(yByX)
            .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
            .sort(ptComparatorAsc);
          return data;
        });

      const opReturnBlocksVsBlocks = client.get('/visualizations/op_return_blocks_vs_blocks/alltime/percentage')
        .then((data) => {
          if (!data.data) {
            throw new Error('No data');
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
        blocksPerDay,
        opReturnBlocksPerDay,
        transactionsPerBlockPerDay,
        opReturnBlocksVsBlocks
      ]).then(dataArray => {
        return {
          blocksPerDay: dataArray[0],
          opReturnBlocksPerDay: dataArray[1],
          transactionsPerBlockPerDay: dataArray[2],
          opReturnBlocksVsBlocks: dataArray[3]
        };
      });
    }
  };
}
