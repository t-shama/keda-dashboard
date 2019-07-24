import React from 'react';
import { Grid } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import {ScaledObjectModel } from '../../models/ScaledObjectModel';
import { LogModel } from '../../models/LogModel';
import { V1HorizontalPodAutoscaler, V1Deployment } from '@kubernetes/client-node';
import SideBarNav from '../SideBarNav';
import LoadingView from '../LoadingView';
import ReplicaDisplay from './ReplicaDisplay';
import ScaledObjectDetailPanel from './ScaledObjectDetailPanel';
import TriggerTable from './TriggerTable';
import ScaleTargetPanel from './ScaleTargetPanel';
import ScaledObjectLogPanel from './ScaledObjectLogPanel';

export default class ScaledObjectDetailsDashboard extends React.Component<ScaledObjectDetailsDashboardProps, { loaded: boolean, name:string, 
    namespace: string, scaledObject:ScaledObjectModel, deployment:V1Deployment, hpa: V1HorizontalPodAutoscaler, logs: LogModel[] }> {

    constructor(props: ScaledObjectDetailsDashboardProps) {
        super(props);

        this.state = {
            loaded: false,
            name: this.props.match.params.name,
            namespace: this.props.match.params.namespace,
            scaledObject: new ScaledObjectModel(),
            deployment: new V1Deployment(),
            hpa: new V1HorizontalPodAutoscaler(),
            logs: []
        };
    }

    formatLogs(text: string, name: string, namespace: string) {
        let logs = text.split("\n");
        let scaledObjectLogs: LogModel[] = [];

        logs.forEach(function(log) {
            let searchLogRegex = new RegExp("time.*level.*msg");
            let splitLogRegex = new RegExp("(time|level|msg)=");
            let scaledObjectLogRegex = new RegExp(namespace + "/" + name + "|" + "keda-hpa-" + name);
            let replicaMetricsRegex = new RegExp("(Scaled Object|Current Replicas|Source): ");
            let removeDoubleQuotes = new RegExp("['\"]+");
            
            if (searchLogRegex.test(log) && scaledObjectLogRegex.test(log) && !replicaMetricsRegex.test(log)) {
                let logComponents = log.split(splitLogRegex);
                let scaledObjectLog = new LogModel();
                scaledObjectLog.msg = logComponents[6].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim();
                scaledObjectLog.source = logComponents[4].trim();
                scaledObjectLog.timestamp =  logComponents[2].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim();
                scaledObjectLog.infoLevel = logComponents[4].trim();

                scaledObjectLogs.push(scaledObjectLog);
            }
        });

        return scaledObjectLogs;
    }

    async componentDidMount() {
        await fetch(`/api/namespace/${this.state.namespace}/deployment/${this.state.name}`)
            .then(res => res.json())
            .then(data => { 
                let deploy = new V1Deployment();
                deploy.metadata = data.metadata;
                deploy.spec = data.spec;
                deploy.status = data.status;
                this.setState({ deployment: deploy }); 
        });

        await fetch(`/api/namespace/${this.state.namespace}/scaledobjects/${this.state.name}`)
            .then(res => res.json())
            .then(data => this.setState({ scaledObject: data }));

        await fetch(`/api/namespace/${this.state.namespace}/hpa/keda-hpa-${this.state.name}`)
            .then(res => res.json())
            .then((json) => this.setState({ hpa: json }));
        
        await fetch('/api/logs')
            .then(res => res.text().then(text => 
                { this.setState( {logs: this.formatLogs(text, this.state.name, this.state.namespace) }) }));

        this.setState({ loaded: true });

        try {
            setInterval(async() => {
                await fetch('/api/logs')
                .then(res => res.text().then(text => 
                    { this.setState( {logs: this.formatLogs(text, this.state.name, this.state.namespace) }) }));
            }, 5000);
        } catch(e) {
            console.log(e);
        }
    }

    getDetailDashboard() {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaledObjectDetailPanel deployment={this.state.deployment} scaledObject={this.state.scaledObject}></ScaledObjectDetailPanel>                    
                    </Grid>
                </Grid>
                
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ReplicaDisplay scaledObjectName={this.props.match.params.name} namespace={this.props.match.params.namespace}></ReplicaDisplay>            
                    </Grid>
                </Grid>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaleTargetPanel hpa={this.state.hpa}></ScaleTargetPanel>            
                    </Grid>
                </Grid>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <TriggerTable scaledObject={this.state.scaledObject}></TriggerTable>            
                    </Grid>
                </Grid>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaledObjectLogPanel logs={this.state.logs}> </ScaledObjectLogPanel>            
                    </Grid>
                </Grid>

            </div>
        );
    }
    
    render() {
        if (this.state.loaded) {
            return <SideBarNav content={this.getDetailDashboard()}/>
        } else {
            return <LoadingView></LoadingView>
        }
    }
}

interface ScaledObjectDetailsDashboardProps extends RouteComponentProps<{ namespace: string, name: string }> {

}