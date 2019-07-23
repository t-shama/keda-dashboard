import React from 'react';
import { Paper, Box, Typography, Table, TableCell, TableBody, TableRow, TableHead, Grid } from '@material-ui/core';

export default class ScaledObjectLogPanel extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <Paper>
                <Box p={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6">Events</Typography>
                        </Grid>
                    </Grid>
                    
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left">Input Metric</TableCell>
                                <TableCell align="left">Source</TableCell>
                                <TableCell align="left">Time Stamp</TableCell>
                                <TableCell align="left">Scaling Decision</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        );
    }
}