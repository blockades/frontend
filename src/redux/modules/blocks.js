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
  // const toMonthTs = (ts) => {
  //   const date = new Date(ts);
  //   date.setDate(1);
  //   date.setHours(0);
  //   date.setMinutes(0);
  //   date.setSeconds(0);
  //   return date.getTime();
  // };
  //
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
      // const blocks = client.get('/visualizations/blocks_all_or_nor/month/num')
      //   .then((data) => {
      //     if (!data.data) {
      //       throw new Error('No data for blocks_all_or_nor');
      //     }
      //
      //     const yByX = {};
      //
      //     data.data.forEach((point) => {
      //       const ptX = toMonthTs(point.x * 1000);
      //       yByX[ptX] = (yByX[ptX] || 0) + point.y;
      //     });
      //
      //     data.data = Object.entries(yByX)
      //       .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
      //       .sort(ptComparatorAsc);
      //
      //     return data;
      //   });
      const blocks = new Promise((resolve) => {
        resolve({
          data: [
            '{"x":1259625600,"all":2490,"opReturn":0,"nonOpReturn":2490}', '{"x":1262304000,"all":5004,"opReturn":0,"nonOpReturn":5004}', '{"x":1264982400,"all":5603,"opReturn":0,"nonOpReturn":5603}', '{"x":1267401600,"all":5201,"opReturn":0,"nonOpReturn":5201}', '{"x":1270080000,"all":5578,"opReturn":0,"nonOpReturn":5578}', '{"x":1272672000,"all":4940,"opReturn":0,"nonOpReturn":4940}', '{"x":1275350400,"all":4746,"opReturn":0,"nonOpReturn":4746}', '{"x":1277942400,"all":7875,"opReturn":0,"nonOpReturn":7875}', '{"x":1280620800,"all":6016,"opReturn":0,"nonOpReturn":6016}', '{"x":1283299200,"all":5545,"opReturn":0,"nonOpReturn":5545}', '{"x":1285891200,"all":5895,"opReturn":0,"nonOpReturn":5895}', '{"x":1288569600,"all":5687,"opReturn":0,"nonOpReturn":5711}'
          ]
            .map(str => JSON.parse(str))
            .map(entry => {
              entry.x *= 1000;
              return entry;
            })
            .map(entry => {
              entry.opReturn = entry.nonOpReturn / 3;
              entry.nonOpReturn = entry.nonOpReturn / 3 * 2;
              return entry;
            })
        });
      });

      // const transactions = client.get('/visualizations/transactions_all_or_nor/month/num')
      //   .then((data) => {
      //     if (!data.data) {
      //       throw new Error('No data for transactions_all_or_nor');
      //     }
      //
      //     const yByX = {};
      //
      //     data.data.forEach((point) => {
      //       const ptX = toMonthTs(point.x * 1000);
      //       yByX[ptX] = (yByX[ptX] || 0) + point.y;
      //     });
      //
      //     data.data = Object.entries(yByX)
      //       .map(([key, value]) => ({x: parseInt(key, 10), y: value}))
      //       .sort(ptComparatorAsc);
      //
      //     return data;
      //   });
      const transactions = new Promise((resolve) => {
        resolve({
          data: [
            '{"x":1259625600,"all":2497,"opReturn":0,"nonOpReturn":2497}', '{"x":1262304000,"all":5056,"opReturn":0,"nonOpReturn":5056}', '{"x":1264982400,"all":5751,"opReturn":0,"nonOpReturn":5751}', '{"x":1267401600,"all":5398,"opReturn":0,"nonOpReturn":5398}', '{"x":1270080000,"all":9631,"opReturn":0,"nonOpReturn":9631}', '{"x":1272672000,"all":6212,"opReturn":0,"nonOpReturn":6212}', '{"x":1275350400,"all":6678,"opReturn":0,"nonOpReturn":6678}', '{"x":1277942400,"all":26488,"opReturn":0,"nonOpReturn":26488}', '{"x":1280620800,"all":11968,"opReturn":0,"nonOpReturn":11968}', '{"x":1283299200,"all":13185,"opReturn":0,"nonOpReturn":13185}', '{"x":1285891200,"all":14386,"opReturn":0,"nonOpReturn":14386}', '{"x":1288569600,"all":63410,"opReturn":0,"nonOpReturn":63410}', '{"x":1291161600,"all":3585,"opReturn":0,"nonOpReturn":3619}'
          ]
            .map(str => JSON.parse(str))
            .map(entry => {
              entry.x *= 1000;
              return entry;
            })
            .map(entry => {
              entry.opReturn = entry.nonOpReturn / 3;
              entry.nonOpReturn = entry.nonOpReturn / 3 * 2;
              return entry;
            })
        });
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
