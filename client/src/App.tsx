import React, { Component } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, Container, Grid, Paper } from '@material-ui/core';
import { ScaledObjectModel } from './models/ScaledObjectModel';
import ScaledObjectCard from './components/ScaledObjectCard';
import { V1Namespace, V1Pod, V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { Style } from 'jss';
import NamespaceCard from './components/NamespaceCard';
import PodCard from './components/PodCard';

class App extends Component<{}, { scaledObjects: ScaledObjectModel[], namespaces: V1Namespace[], pods: V1Pod[], hpas: V1HorizontalPodAutoscaler[] }> {

    constructor(props: {}) {
        super(props);
        this.state = {
            scaledObjects: [],
            namespaces: [],
            pods: [],
            hpas: []
        };
    }

    componentDidMount() {
        fetch('/api/scaledobjects')
            .then(res => res.json())
            .then(({ items }) => this.setState({ scaledObjects: items }));

        fetch('/api/scaledobjects')
            .then(res => res.json())
            .then(json => console.log(json));

        fetch('/api/namespaces')
            .then(res => res.json())
            .then(json => console.log(json));

        fetch('/api/namespaces')
            .then(res => res.json())
            .then(({ items }) => this.setState({ namespaces: items }));

        fetch('/api/pods')
            .then(res => res.json())
            .then(json => console.log(json));

        fetch('/api/pods')
            .then(res => res.json())
            .then(({ items }) => this.setState({ pods: items }));

        fetch('/api/hpa')
            .then(res => res.json())
            .then(json => console.log(json));

        fetch('/api/hpa')
            .then(res => res.json())
            .then(({ items }) => this.setState({ hpas: items }));
    }

    static style: Style = {
        container: {
            marginTop: '100px',
        }
    };

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="absolute" >
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="Open drawer">
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                            KEDA Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container style={App.style.container} maxWidth="lg">
                    <h1> Scaled Objects: </h1>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper>
                                {this.state.scaledObjects
                                    .map(o => <ScaledObjectCard scaledObject={o} />)}
                            </Paper>
                        </Grid>
                    </Grid>

                    <h1> Namespaces: </h1>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper>
                                {this.state.namespaces
                                    .map(o => <NamespaceCard namespace={o} />)}
                            </Paper>
                        </Grid>
                    </Grid>

                    <h1> Pods: </h1>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper>
                                {this.state.pods
                                    .map(o => <PodCard pod={o} />)}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

            </React.Fragment>
        );
    }
}
export default App;