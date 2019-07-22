import React from 'react';
import { Box, Paper, Grid } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import {ScaledObjectModel } from '../../models/ScaledObjectModel';
import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import SideBarNav from '../SideBarNav';
import LoadingView from '../LoadingView';
import ReplicaDisplay from './ReplicaDisplay';
import ScaledObjectDetailPanel from './ScaledObjectDetailPanel';

export default class ScaledObjectDetailsDashboard extends React.Component<ScaledObjectDetailsDashboardProps, { loaded: boolean, name:string, scaledObject:ScaledObjectModel, hpa: V1HorizontalPodAutoscaler }> {
    constructor(props: ScaledObjectDetailsDashboardProps) {
        super(props);

        this.state = {
            loaded: false,
            name: this.props.match.params.name,
            scaledObject: new ScaledObjectModel(),
            hpa: new V1HorizontalPodAutoscaler()
        };
    }

    async componentDidMount() {
        this.setState({ loaded: true });

        await fetch(`/api/deployment/${this.state.name}`)
        .then(res => res.json())
        .then(data => { console.log(data); this.setState({scaledObject: data })});
    }

    getDetailDashboard() {
        return (
            <div>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ScaledObjectDetailPanel scaledObject={this.state.scaledObject}></ScaledObjectDetailPanel>                    
                    </Grid>
                </Grid>
                
                <Grid container spacing={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <ReplicaDisplay scaledObjectName={this.props.match.params.name}></ReplicaDisplay>            
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

interface ScaledObjectDetailsDashboardProps extends RouteComponentProps<{ name: string }> {

}