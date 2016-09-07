import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import stats from './stats';
import blocks from './blocks';
import block from './block';
import transaction from './transaction';
import signal from './signal';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  stats,
  blocks,
  block,
  transaction,
  signal,
});
