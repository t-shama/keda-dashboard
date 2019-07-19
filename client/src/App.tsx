import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { Style } from 'jss';
import ScaleControllerDashboard from './components/ScaleControllerDashboard';
import ScaledObjectsDashboard from './components/ScaledObjectsDashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

class App extends Component<{}, {}> {
    constructor(props: {}) {
        super(props);
        this.state = { };
    }

    static style: Style = {
        container: {
            marginTop: '100px',
            color: 'black'
        },
        appBar: {
            background: '#2b78e4'
        }
    };


    render() {
        return (
            <React.Fragment>
                <CssBaseline /> 
                <Router>
                    <Switch>
                        <Route exact path="/" component={ScaleControllerDashboard}></Route>
                    </Switch>
                    <Switch>
                        <Route exact path="/scaled-objects" component={ScaledObjectsDashboard}></Route>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

export default App;