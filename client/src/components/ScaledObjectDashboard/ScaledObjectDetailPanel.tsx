import React from 'react';
import { Paper, Typography, Grid, Chip, Box, Divider } from '@material-ui/core';
import { ScaledObjectModel } from '../../models/ScaledObjectModel';
import { V1Deployment } from '@kubernetes/client-node';

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

const ScaledObjectDetail: React.FunctionComponent<{ detailName: string, detailValue?: any, detailValueList?: any}> = (props) => {
    let valueDisplay = null;

    if (props.detailValue) {
        valueDisplay = <Typography>{ props.detailValue }</Typography>
    } else if (props.detailValueList) {
        valueDisplay = listChips(props.detailName, props.detailValueList);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={3} lg={3}>
                <Typography style={{fontWeight:'bold'}}> { props.detailName + ":" } </Typography>
            </Grid>
            <Grid item xs={6} md={9} lg={9}>
                { valueDisplay }
            </Grid>
        </Grid>
    );
};

const ScaledObjectDetailPanel: React.FunctionComponent<{ deployment: V1Deployment}> = (props) => {
    return (
        <Paper>
            <Box p={4}>
                <Typography variant="h6" id="Details">Details</Typography>
                <Divider /> <br/>
                <ScaledObjectDetail detailName={"Name"} detailValue={props.deployment.metadata!.name}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Type"} detailValue={(props.deployment.spec) ? "triggers":"not found"}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Namespace"} detailValue={props.deployment!.metadata!.namespace}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Labels"} detailValueList={ props.deployment!.metadata!.labels}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Annotations"} detailValueList={props.deployment!.metadata!.annotations}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Selector"} detailValueList={props.deployment.spec!.selector}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Creation Time"} detailValue={props.deployment.metadata!.creationTimestamp}></ScaledObjectDetail>
                <ScaledObjectDetail detailName={"Last Active Time"} detailValue={props.deployment.metadata!.creationTimestamp}></ScaledObjectDetail>
            </Box>
        </Paper>
    );
}

export default ScaledObjectDetailPanel;