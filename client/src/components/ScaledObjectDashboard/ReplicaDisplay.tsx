import React from 'react';
import { Typography, Paper, Box, Divider } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

export default class ReplicaDisplay extends React.Component<{scaledObjectName: string, namespace:string}, {currentReplicas: number, 
    dataset: {[key: string]: any}[], logs: string}> {
    private numBarsInGraph:number = 24;

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

        // (logs.length-1)%60
        for (let i = 0; i < logs.length; i+=30) {
            let splitLogRegex = new RegExp("(time|level|msg)=");
            let scaledObjectLogRegex = new RegExp(namespace + "/" + name + "|" + "keda-hpa-" + name);
            let removeDoubleQuotes = new RegExp("['\"]+");

            if (scaledObjectLogRegex.test(logs[i])) {
                let metricsInLog: {[key: string]: any} = {};
                let logComponents = logs[i].split(splitLogRegex);
                let metricInfo =  logComponents[6].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim().split("; ");
                let timestamp = logComponents[2].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim();

                metricsInLog['timestamp'] = timestamp;
                metricsInLog[name] = Number(metricInfo[2].split(": ")[1].trim());

                if (dataset.length >= this.numBarsInGraph) {
                    while (dataset.length >= this.numBarsInGraph) {
                        dataset.shift();
                    }
                }
                dataset.push(metricsInLog);
            }
        }

        return dataset;
    }

    async componentDidMount() {
        await fetch('/api/logs/metrics')
            .then(res => res.text().then(text => 
                { this.setState( {logs: text }) }));

        this.setState({dataset: this.getMetricsFromLogs(this.state.logs, this.props.scaledObjectName, this.props.namespace)});

        try {
            setInterval(async() => {
                await fetch('/api/logs/metrics')
                .then(res => res.text().then(text => 
                    { this.setState( {logs: text }) }));

                this.setState({dataset: this.getMetricsFromLogs(this.state.logs, this.props.scaledObjectName, this.props.namespace)});
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