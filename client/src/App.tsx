import React, { Component } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { CssBaseline, AppBar, Toolbar, IconButton, Typography, Container, Grid, Paper } from '@material-ui/core';
import { ScaledObjectModel } from './models/ScaledObjectModel';
import ScaledObjectCard from './components/ScaledObjectCard';
import { Style } from 'jss';

class App extends Component<{}, { scaledObjects: ScaledObjectModel[] }> {

    constructor(props: {}) {
        super(props);
        this.state = {
            scaledObjects: []
        };
    }

    componentDidMount() {
        fetch('/api/scaledobjects')
            .then(res => res.json())
            .then(({ items }) => this.setState({ scaledObjects: items }));
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
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper>
                                {this.state.scaledObjects
                                    .map(o => <ScaledObjectCard scaledObject={o} />)}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}
export default App;