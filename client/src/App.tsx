import React, { Component } from 'react';
import { CssBaseline, Grid, Paper, CircularProgress } from '@material-ui/core';
import { ScaledObjectModel } from './models/ScaledObjectModel';
import ScaledObjectCard from './components/ScaledObjectCard';
import {  V1Deployment } from '@kubernetes/client-node';
import { Style } from 'jss';
import SideBarNav from './components/SideBarNav';
import ScaleControllerView from './components/ScaleControllerView';
import { ScaleControllerLog } from './models/ScaleControllerLog';

class App extends Component<{}, { loaded: boolean, route: string, scaledObjects: ScaledObjectModel[], logs: ScaleControllerLog[], keda: V1Deployment, metadata: ""}> {
    constructor(props: {}) {
        super(props);

        this.state = {
            loaded: false,
            route: "/",
            scaledObjects: [],
            keda: new V1Deployment(),
            logs: [],
            metadata: "",
        };
    }

    formatLogs(text: string) {
        let logs = text.split("\n");
        let scaleControllerLogs: ScaleControllerLog[] = [];

        logs.forEach(function(log) {
            let logRegex = new RegExp("time.*level.*msg");
            let logSplit = new RegExp("(time|level|msg)=");
            let removeDoubleQuotes = new RegExp("^\"|\"$");
            
            if (logRegex.test(log)) {
                let logComponents = log.split(logSplit);
                let scaleControllerLog = new ScaleControllerLog(logComponents[6].replace(removeDoubleQuotes, "").trim(), logComponents[4].trim(), 
                                        logComponents[2].replace(removeDoubleQuotes, "").trim(), logComponents[4].trim());
                scaleControllerLogs.push(scaleControllerLog);
            }
        });

        return scaleControllerLogs;
    }

    async fetchRequests() {
        await fetch('/api/scaledobjects')
            .then(res => res.json());

        await fetch('/api/keda')
            .then(res => { return res.json(); })
            .then(data => { 
                let keda = new V1Deployment();
                keda.metadata = data.metadata;
                keda.spec = data.spec;
                keda.status = data.status;
                this.setState({ keda: keda }); 
        });

        await fetch('/api/logs')
            .then(res => res.text().then(text => 
                { this.setState( {logs: this.formatLogs(text) }) }));

        this.setState( { loaded:true });
    }

    async componentDidMount() {
        await this.fetchRequests();
        //this.setState({route: window.location.pathname});
        //setInterval(this.fetchRequests, 30000)
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

    getScaleControllerOverview() {
        return (
            <ScaleControllerView deployment={this.state.keda} logs={this.state.logs}></ScaleControllerView>
        );
    }

    getScaledObjectContent() {
        return (
            <div>
                <h1> Scaled Objects: </h1>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            {this.state.scaledObjects
                                .map(o => <ScaledObjectCard scaledObject={o} />)}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

    getNavLinks() {
        return [
                {text: "Overview", link: "/"}, 
                {text: "Scaled Objects", link: "/scaledobjects"}
            ];
    }
    
    render() {
        let content = null;
        let navLinks = this.getNavLinks();

        if (this.state.route === "/" && this.state.loaded) {
            content = this.getScaleControllerOverview();
        } else if (this.state.route.toLowerCase() === "scaledobjects" && this.state.loaded) {
            content = this.getScaledObjectContent();
        } else {
            content = <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '80vh'}}><CircularProgress/></div>
        }

        return (
            
            <React.Fragment>
                <CssBaseline /> 
                <SideBarNav content={content} navigationLinks={navLinks}></SideBarNav>         
            </React.Fragment>
        );
    }
}

export default App;