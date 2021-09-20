import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../style/App.css';

import HomePage from './home/HomePage';
import MetricsPage from './metrics/MetricsPage';
import AdvancePage from './advance/AdvancePage';
import HelpPage from './help/HelpPage';

const App = () => {

    return <Router>
        <Switch>
            <Route path="/" exact={true} component={HomePage} />
            <Route path="/metrics" exact={true} component={MetricsPage} />
            <Route path="/advance" exact={true} component={AdvancePage} />
            <Route path="/help" exact={true} component={HelpPage} />
        </Switch>
    </Router>
}

export default App;