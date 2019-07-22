import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { Style } from 'jss';
import ScaleControllerDashboard from './components/ScaleControllerDashboard/ScaleControllerDashboard';
import ScaledObjectsDashboard from './components/ScaledObjectsDashboard/ScaledObjectsDashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScaledObjectDetailsDashboard from './components/ScaledObjectDashboard/ScaledObjectDashboard';

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
                        <Route exact path="/scaled-objects" component={ScaledObjectsDashboard}></Route>
                        <Route path="/scaled-objects/namespace/:namespace/scaled-object/:name" component={ScaledObjectDetailsDashboard}></Route>
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

export default App;