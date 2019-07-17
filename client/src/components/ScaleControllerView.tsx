import React from 'react';
import { Paper, Typography, Table, TableCell, TableBody, TableRow, TableHead, Grid, Chip } from '@material-ui/core';
import { V1Deployment } from '@kubernetes/client-node';
import { ScaleControllerLog } from '../models/ScaleControllerLog';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Error from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';
import WarningRounded from '@material-ui/icons/WarningRounded';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 2),
    },
    bold: {
        fontWeight: 'bold',
    },
    statusOk: {
        color: '#4caf50',
    },
    statusWarning: {
        color: '#fdd835'
    }
  }),
);

function handleClick() { }

function listChips(detailName: string, list: Object) {
    let listObject = JSON.parse(JSON.stringify(list));
    let listItems: string[] = [];

    for (let key in listObject) {
        listItems.push(key);
    }

    switch(detailName) {
        case "Labels": {
            return listItems.map((item:string) => <Chip label={item + ": " + listObject[item]} onClick={handleClick}/>);
        }
        case "Annotations": {
            return listItems.map((item) => <Chip label={item} onClick={handleClick}/>);
        }
        case "Selector": {
            listObject = listObject["matchLabels"];
            listItems = [];
            
            for (let key in listObject) {
                listItems.push(key);
            }
            return listItems.map((item: string) => <Chip label={item + ": " + listObject[item]}  onClick={handleClick}/>)
        }
    }
}

const ScaleControllerDetail: React.FunctionComponent<{ detailName: string, detailValue?: any, detailValueList?: any}> = (props) => {
    const classes = useStyles();

    let valueDisplay = null;
    
    if (props.detailValue) {
        valueDisplay = <Typography>{ props.detailValue }</Typography>
    } else if (props.detailValueList) {
        valueDisplay = listChips(props.detailName, props.detailValueList);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={3} lg={3}>
                <Typography className={classes.bold}> { props.detailName + ":" } </Typography>
            </Grid>
            <Grid item xs={6} md={9} lg={9}>
                { valueDisplay }
            </Grid>
        </Grid>
    );
};

const ScaleControllerDetails: React.FunctionComponent<{ deployment: V1Deployment }> = (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <ScaleControllerDetail detailName={"Name"} detailValue={props.deployment.metadata!.name}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Namespace"} detailValue={props.deployment!.metadata!.namespace}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Labels"} detailValueList={ props.deployment!.metadata!.labels}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Annotations"} detailValueList={props.deployment!.metadata!.annotations}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Selector"} detailValueList={props.deployment.spec!.selector}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Creation Time"} detailValue={props.deployment.metadata!.creationTimestamp}></ScaleControllerDetail>
            <ScaleControllerDetail detailName={"Last Scale Time"} detailValue={props.deployment.metadata!.creationTimestamp}></ScaleControllerDetail>
        </Paper>
    );
};

const ReplicaDisplay: React.FunctionComponent<{  }> = (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" id="tableTitle">Replicas</Typography>
        </Paper>
    );
};

const ScaleControllerLogRow: React.FunctionComponent<{ log: ScaleControllerLog }> = (props) => {
    const classes = useStyles();
    let icon = <CheckCircle className={classes.statusOk}></CheckCircle>;

    if (props.log.infoLevel === "error") {
        icon = <Error color="error"></Error>
    } else if (props.log.infoLevel === "warning") {
        icon = <WarningRounded className={classes.statusWarning}></WarningRounded>
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

const ScaleControllerLogDisplay: React.FunctionComponent<{ logs: ScaleControllerLog[] }> = (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
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
        </Paper>
    );
};

const ScaleControllerView: React.FunctionComponent<{ deployment: V1Deployment, logs: ScaleControllerLog[]  }> = (props) => {
    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={12} md={12} lg={12}>
                        <ScaleControllerDetails deployment={props.deployment}></ScaleControllerDetails>
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={12} md={12} lg={12}>
                    <ReplicaDisplay></ReplicaDisplay>
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={12} md={12} lg={12}>
                    <ScaleControllerLogDisplay logs={props.logs}></ScaleControllerLogDisplay>
                </Grid>
            </Grid>
        </div>
    );
};

export default ScaleControllerView;