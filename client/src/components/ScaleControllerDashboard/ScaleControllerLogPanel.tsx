import React from 'react';
import { Paper, Box, Typography, Table, TableCell, TableBody, TableRow, TableHead, Grid } from '@material-ui/core';
import { ScaleControllerLog } from '../../models/ScaleControllerLog';
import Error from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';
import WarningRounded from '@material-ui/icons/WarningRounded';

const ScaleControllerLogRow: React.FunctionComponent<{ log: ScaleControllerLog }> = (props) => {
    let icon = <CheckCircle style={{color: '#4caf50'}}></CheckCircle>;

    if (props.log.infoLevel === "error") {
        icon = <Error color="error"></Error>
    } else if (props.log.infoLevel === "warning") {
        icon = <WarningRounded style={{color: '#fdd835'}}></WarningRounded>
    }

    return (
        <TableRow key={props.log.timestamp}>
            <TableCell align="left"> { icon }</TableCell>
            <TableCell align="left">{props.log.msg}</TableCell>
            <TableCell align="left">{props.log.source}</TableCell>
            <TableCell align="left">{props.log.timestamp}</TableCell>
        </TableRow>
    );
};

const ScaleControllerLogPanel: React.FunctionComponent<{ logs: ScaleControllerLog[] }> = (props) => {
    return (
        <Paper>
            <Box p={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h6" id="tableTitle">Events</Typography>
                    </Grid>
                </Grid>
                
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">Message</TableCell>
                            <TableCell align="left">Source</TableCell>
                            <TableCell align="left">Time Stamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            { props.logs.map(log => <ScaleControllerLogRow log={log}></ScaleControllerLogRow> )}
                    </TableBody>
                </Table>
            </Box>
        </Paper>
    );
};

export default ScaleControllerLogPanel;