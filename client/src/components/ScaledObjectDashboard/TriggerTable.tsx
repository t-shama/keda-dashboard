import React from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box } from '@material-ui/core';
import { ScaledObjectModel, ScaledObjectTriggers } from '../../models/ScaledObjectModel';


const TriggerTableRow: React.FunctionComponent<{trigger: ScaledObjectTriggers}> = (props) => {
    return (
        <TableRow>
            <TableCell align="left">{(props.trigger.name || props.trigger.name !== "") ? props.trigger.name:"not found"}</TableCell>
            <TableCell align="left">{props.trigger.type}</TableCell>
            <TableCell align="left">
            {
                Object.keys(props.trigger.metadata).map((key, index) => 
                    <p key={index}>{key + ": " + props.trigger.metadata[key] }</p>
                )}
            </TableCell>
        </TableRow>
    );
}

export default class TriggerTable  extends React.Component<{scaledObject: ScaledObjectModel}, {}> {
    render () {
        return (
            <Paper>
                <Box p={4}>
                    <Typography variant="h6" id="Details">Triggers</Typography>
                    <Table> 
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Reference</TableCell>
                                <TableCell align="left">Metadata</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                                { this.props.scaledObject.spec.triggers.map((trigger, index) => <TriggerTableRow trigger={trigger} key={index}></TriggerTableRow> )}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        );
    }
}