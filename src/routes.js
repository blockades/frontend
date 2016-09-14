import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
  App,
  Block,
  Charts,
  Home,
  NotFound,
  Search,
  Stats,
  Transaction,
} from 'containers';

export default () => {
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home} />

      { /* Routes */ }
      <Route path="blocks/:id" component={Block} />
      <Route path="charts" component={Charts} />
      <Route path="search" component={Search} />
      <Route path="stats" component={Stats} />
      <Route path="transactions/:id" component={Transaction} />

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
