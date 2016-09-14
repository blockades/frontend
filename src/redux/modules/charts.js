import moment from 'moment';

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
        span: null,
        t: null,
        tPrev: null,
        tNext: null,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.result.data,
        span: action.result.span,
        t: action.result.t,
        tPrev: action.result.tPrev,
        tNext: action.result.tNext,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        data: null,
        span: null,
        t: null,
        tPrev: null,
        tNext: null,
        error: action.error && action.error.message || JSON.stringify(action.error)
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

export function isLoaded(globalState, span, t) {
  return globalState.charts && globalState.charts.loaded &&
    globalState.charts.span === span && globalState.charts.t === t;
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

export function load(span, t) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      span = span || 'year';

      let tPrev = null;
      let tNext = null;

      let period = 'day';
      if (span === 'year') period = 'month';
      if (span === 'alltime') period = 'year';

      const filter = (data) => {
        if (span === 'alltime') {
          return data;
        }

        if (span === 'year') {
          return data.filter(d => {
            return String(moment(d.x).year()) === String(t);
          });
        }

        if (span === 'month') {
          return data.filter(d => {
            return moment(d.x).format('MMM YYYY') === String(t);
          });
        }
      };

      const blocks = client
        .get('/visualizations/blocks_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!Array.isArray(data.data)) {
            throw new Error('API did not return any data for blocks_all_or_nor');
          }

          return filter(data.data);
        });

      const transactions = client
        .get('/visualizations/transactions_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!Array.isArray(data.data)) {
            throw new Error('API did not return any data for transactions_all_or_nor');
          }

          return filter(data.data);
        });

      const signals = client
        .get('/visualizations/signals_all_or_nor/' + period + '/num')
        .then((data) => {
          if (!Array.isArray(data.data)) {
            throw new Error('API did not return any data for signals_all_or_nor');
          }

          return filter(data.data);
        });

      // TODO make api return all this in only 1 request?
      return Promise.all([
        blocks,
        transactions,
        signals
      ]).then(dataArray => {
        const blockData = dataArray[0];
        const transactionData = dataArray[1];
        const signalData = dataArray[2];

        const lastX = blockData && blockData[blockData.length - 1] && blockData[blockData.length - 1].x;

        if (span === 'alltime') {
          t = 'All Time';
        }

        if (span === 'year') {
          t = String(t || moment(lastX).year());
          tPrev = String(parseInt(t, 10) - 1);
          tNext = String(parseInt(t, 10) + 1);
        }

        if (span === 'month') {
          t = String(t || moment(lastX).format('MMM YYYY'));
          tPrev = moment(t, 'MMM YYYY').add(-1, 'months').format('MMM YYYY');
          tNext = moment(t, 'MMM YYYY').add(+1, 'months').format('MMM YYYY');
        }

        return {
          data: {
            block: blockData,
            transaction: transactionData,
            signal: signalData,
          },
          span,
          t,
          tPrev,
          tNext,
        };
      });
    }
  };
}
