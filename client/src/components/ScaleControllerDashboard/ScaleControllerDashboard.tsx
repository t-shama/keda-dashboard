import React from 'react';
import { Grid, CssBaseline } from '@material-ui/core';
import { V1Deployment } from '@kubernetes/client-node';
import { ScaleControllerLog } from '../../models/ScaleControllerLog';
import SideBarNav from '../SideBarNav';
import LoadingView from '../LoadingView';
import ScaleControllerDetailPanel from './ScaleControllerDetailPanel';
import ScaleControllerLogPanel from './ScaleControllerLogPanel';

export default class ScaleControllerDashboard extends React.Component<ScaleControllerDashboardProps, ScaleControllerDashboardState> {
    constructor(props: ScaleControllerDashboardProps) {
        super(props);

        this.state = {
            loaded: false,
            deployment: new V1Deployment(),
            logs: []
        };
    }

    formatLogs(text: string) {
        let logs = text.split("\n");
        let scaleControllerLogs: ScaleControllerLog[] = [];

        logs.forEach(function(log) {
            let searchLogRegex = new RegExp("time.*level.*msg");
            let splitLogRegex = new RegExp("(time|level|msg)=");
            let removeDoubleQuotes = new RegExp("^\"|\"$");
            
            if (searchLogRegex.test(log)) {
                let logComponents = log.split(splitLogRegex);
                let scaleControllerLog = new ScaleControllerLog(logComponents[6].replace(removeDoubleQuotes, "").trim(), logComponents[4].trim(), 
                                        logComponents[2].replace(removeDoubleQuotes, "").trim(), logComponents[4].trim());
                scaleControllerLogs.push(scaleControllerLog);
            }
        });

        return scaleControllerLogs;
    }

    async componentDidMount() {
        await fetch('/api/keda')
            .then(res => { return res.json(); })
            .then(data => { 
                let keda = new V1Deployment();
                keda.metadata = data.metadata;
                keda.spec = data.spec;
                keda.status = data.status;
                this.setState({ deployment: keda }); 
        });

        await fetch('/api/logs/scaledecision')
            .then(res => res.text().then(text => 
                { this.setState( {logs: this.formatLogs(text) }) }));

        this.setState( { loaded:true });
    }

    getScaleControllerDashboardContent() {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaleControllerDetailPanel deployment={this.state.deployment}/>
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaleControllerLogPanel logs={this.state.logs}></ScaleControllerLogPanel>
                    </Grid>
                </Grid>
            </div>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <React.Fragment>
                   <CssBaseline /> 
                   <SideBarNav content={this.getScaleControllerDashboardContent()}></SideBarNav>         
               </React.Fragment>
            );
        } else {
            return <LoadingView></LoadingView>
        }
    }
}

interface ScaleControllerDashboardProps {
}

interface ScaleControllerDashboardState {
    loaded: boolean;
    deployment: V1Deployment;
    logs: ScaleControllerLog[];
}