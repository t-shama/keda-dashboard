import React from 'react';
import { Paper, Typography, Grid, Chip, Divider, Box } from '@material-ui/core';
import { ScaledObjectModel } from '../../models/ScaledObjectModel';

export default class ScaleTargetPanel  extends React.Component<{}, {}> {


    render () {
        return (
            <Paper>
                <Box p={4}>
                    <Typography variant="h6" id="Details">Details</Typography>
                    <Divider /> <br/>
                </Box>
            </Paper>
        );
    }
}