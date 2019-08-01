import React from 'react';
import { Typography, Paper, Box } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

export default class ReplicaDisplay extends React.Component<{scaledObjectName: string, namespace:string}, {currentReplicas: number, 
    dataset: {[key: string]: any}[], logs: string}> {
    private numBarsInGraph:number = 40;
    private timeStampFrequency:number = 10;

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

        let totalReplicas = 0;

        // (logs.length-1)%10
        for (let i = 0; i < logs.length; i+=1) {            
            let splitLogRegex = new RegExp("(time|level|msg)=");
            let scaledObjectLogRegex = new RegExp(`${namespace}/${name}|keda-hpa-${name}`);
            let removeDoubleQuotes = new RegExp("['\"]+");

            if (scaledObjectLogRegex.test(logs[i])) {
                let metricsInLog: {[key: string]: any} = {};
                let logComponents = logs[i].split(splitLogRegex);
                let metricInfo = logComponents[6].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim().split("; ");
                let timestamp = logComponents[2].replace(removeDoubleQuotes, "").replace(removeDoubleQuotes, "").trim();

                totalReplicas += Number(metricInfo[2].split(": ")[1].trim());

                if (dataset.length > this.numBarsInGraph) {
                    while (dataset.length > this.numBarsInGraph) {
                        dataset.shift();
                    }
                }
                
                // metricsInLog['timestamp'] = timestamp;
                // metricsInLog[name] = totalReplicas;
                // dataset.push(metricsInLog);

                if (i%this.timeStampFrequency===0) {
                    metricsInLog['timestamp'] = timestamp;
                    let avgReplicas = totalReplicas/this.timeStampFrequency;
                    avgReplicas = Number(avgReplicas.toFixed(2));
                    metricsInLog[name] = avgReplicas;
    
                    dataset.push(metricsInLog);

                    totalReplicas = 0;
                } 
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

    componentWillUnmount() {
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
                            margin={{ top: 50, right: 130, bottom: 130, left: 60 }}
                            padding={0.3}
                            colors={{ scheme: 'paired' }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 32,
                                legend: 'timestamp',
                                legendPosition: 'middle',
                                legendOffset: 92.
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
                            enableGridY={false}
                            animate={true}
                            motionStiffness={90}
                            motionDamping={15}
                        />
                    </div>
                </Box>
            </Paper>
        );
    }
}