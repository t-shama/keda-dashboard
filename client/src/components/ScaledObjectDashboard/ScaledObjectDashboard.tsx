import React from 'react';
import { Grid } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import {ScaledObjectModel } from '../../models/ScaledObjectModel';
import { V1HorizontalPodAutoscaler, V1Deployment } from '@kubernetes/client-node';
import SideBarNav from '../SideBarNav';
import LoadingView from '../LoadingView';
import ReplicaDisplay from './ReplicaDisplay';
import ScaledObjectDetailPanel from './ScaledObjectDetailPanel';
import ScaleTargetPanel from './ScaleTargetPanel';

export default class ScaledObjectDetailsDashboard extends React.Component<ScaledObjectDetailsDashboardProps, { loaded: boolean, name:string, 
    namespace: string, scaledObject:ScaledObjectModel, deployment:V1Deployment, hpa: V1HorizontalPodAutoscaler }> {
    constructor(props: ScaledObjectDetailsDashboardProps) {
        super(props);

        this.state = {
            loaded: false,
            name: this.props.match.params.name,
            namespace: this.props.match.params.namespace,
            scaledObject: new ScaledObjectModel(),
            deployment: new V1Deployment(),
            hpa: new V1HorizontalPodAutoscaler()
        };
    }

    async componentDidMount() {
        await fetch(`/api/namespace/${this.state.namespace}/deployment/${this.state.name}`)
            .then(res => res.json())
            .then(data => { 
                console.log("here");
                let deploy = new V1Deployment();
                deploy.metadata = data.metadata;
                deploy.spec = data.spec;
                deploy.status = data.status;
                this.setState({ deployment: deploy }); 
        });

        console.log(this.state.deployment);

        this.setState({ loaded: true });
    }

    getDetailDashboard() {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaledObjectDetailPanel deployment={this.state.deployment}></ScaledObjectDetailPanel>                    
                    </Grid>
                </Grid>
                
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ReplicaDisplay scaledObjectName={this.props.match.params.name} namespace={this.props.match.params.namespace}></ReplicaDisplay>            
                    </Grid>
                </Grid>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaleTargetPanel></ScaleTargetPanel>            
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