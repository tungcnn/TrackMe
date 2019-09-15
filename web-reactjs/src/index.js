import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-snapshot';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Router, Route, browserHistory } from 'react-router';

import Login from './screens/Login/Login';
import App from './screens/App/App';
import Register from './screens/Register/Register';
import DevicesList from './screens/DevicesList/DevicesList';

render(
    <Router history={browserHistory}>
        <Route path="/" component={Login} />
        <Route path="/App" component={App} />
        <Route path="/Register" component={Register} />
        <Route path="/DevicesList" component={DevicesList} />
    </Router>
    , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();