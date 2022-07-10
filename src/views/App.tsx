import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../style/App.css';

import HomePage from './home/HomePage';
import MetricsPage from './metrics/MetricsPage';
import AdvancePage from './advance/AdvancePage';
import HelpPage from './help/HelpPage';
import IframeVerify from './iframes/verify/IframeVerify';
import IframeStamp from './iframes/stamp/IframeStamp';
import IframePendingStamp from './iframes/stamp/IframePendingStamp';
import IframeMetricsByFile from './iframes/metrics/IframeMetricsByFile';
import IframeMetricsByTime from './iframes/metrics/IframeMetricsByTime';

const App = () => {

  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
        <Route path="/metrics" exact={true} component={MetricsPage} />
        <Route path="/advance" exact={true} component={AdvancePage} />
        <Route path="/help" exact={true} component={HelpPage} />
        <Route path="/iframe_stamp" exact={true} component={IframeStamp} />
        <Route path="/iframe_pending_stamp" exact={true} component={IframePendingStamp} />
        <Route path="/iframe_verify" exact={true} component={IframeVerify} />
        <Route path="/iframe_metrics_file" exact={true} component={IframeMetricsByFile} />
        <Route path="/iframe_metrics_time" exact={true} component={IframeMetricsByTime} />
      </Switch>
    </Router>
  );
}

export default App;