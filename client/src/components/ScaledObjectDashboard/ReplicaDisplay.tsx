import React from 'react';
import { Typography, Paper, Box, Divider } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';
import { LogModel } from '../../models/LogModel';
import { string } from 'prop-types';

export default class ReplicaDisplay extends React.Component<{scaledObjectName: string, namespace:string}, {currentReplicas: number, 
    dataset: {[key: string]: any}[], logs: string}> {

    constructor(props: {scaledObjectName: string, namespace:string}) {
        super(props);

        this.state = {
            currentReplicas: 0,
            dataset: [],
            logs: ""
        }
    }

    getMetricsFromLogs(text: string, name: string, namespace: string) {
        let logs = text.split("\n");
        let dataset: {[key: string]: number}[] = [];

        for (let i = 0; i < logs.length; i+=8) {
            let metricsInLog: {[key: string]: any} = {};
            let searchLogRegex = new RegExp("time.*level.*msg");
            let splitLogRegex = new RegExp("(time|level|msg)=");
            let scaledObjectLogRegex = new RegExp(namespace + "/" + name + "|" + "keda-hpa-" + name);
            let replicaMetricsRegex = new RegExp("(Scaled Object|Current Replicas|Source): ");
            let removeDoubleQuotes = new RegExp("['\"]+");

            if (searchLogRegex.test(logs[i]) && scaledObjectLogRegex.test(logs[i]) && replicaMetricsRegex.test(logs[i])) {
                let logComponents = logs[i].split(splitLogRegex);
                let metricInfo =  logComponents[6].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim().split("; ");
                let timestamp = logComponents[2].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim();

                metricsInLog['timestamp'] = timestamp;
                metricsInLog[name] = Number(metricInfo[1].split(": ")[1].trim());

                dataset.push(metricsInLog);
            }
        }

        console.log(dataset);

        return dataset;
    }

    async componentDidMount() {
        await fetch('/api/keda/logs')
            .then(res => res.text().then(text => 
                { this.setState( {logs: text }) }));

        let updatedDataset = this.getMetricsFromLogs(this.state.logs, this.props.scaledObjectName, this.props.namespace);
        this.setState({dataset: updatedDataset});

        try {
            setInterval(async() => {
                await fetch('/api/keda/logs')
                .then(res => res.text().then(text => 
                    { this.setState( {logs: text }) }));

                let updatedDataset = this.getMetricsFromLogs(this.state.logs, this.props.scaledObjectName, this.props.namespace);
                this.setState({dataset: updatedDataset});
            }, 30000);
        } catch(e) {
            console.log(e);
        }
    }

    async getCurrentReplicaCount() {
        await fetch(`/api/namespace/${this.props.namespace}/deployment/${this.props.scaledObjectName}`)
        .then(res => res.json())
        .then((data) => { 
            let currentReplicas = (data.spec!.replicas === undefined) ? 0:data.spec!.replicas;
            this.setState({currentReplicas: currentReplicas });
        });
    }
    
    render() {

        return (
            <Paper>
                <Box p={4}>
                    <Typography variant="h6" id="Replica Count">Replicas</Typography>
                    <div style={{ height: 400 }}>
                        <ResponsiveBar
                            data={this.state.dataset}
                            keys={[this.props.scaledObjectName]}
                            indexBy="timestamp"
                            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                            padding={0.3}
                            colors={{ scheme: 'nivo' }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'timestamp',
                                legendPosition: 'middle',
                                legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'replicas',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                            animate={false}
                            motionStiffness={90}
                            motionDamping={15}
                        />
                    </div>
                </Box>
            </Paper>
        );
    }
}