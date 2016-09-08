import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import app from './app';
import block from './block';
import charts from './charts';
import search from './search';
import signal from './signal';
import stats from './stats';
import transaction from './transaction';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  app,
  block,
  charts,
  search,
  signal,
  stats,
  transaction,
});
