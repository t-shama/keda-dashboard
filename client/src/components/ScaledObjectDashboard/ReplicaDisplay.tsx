import React from 'react';
import { Typography, Paper, Box, Divider } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

export default class ReplicaDisplay extends React.Component<{scaledObjectName: string, namespace:string}, {currentReplicas: number, dataset: {[key: string]: number}[]}> {
    replicaAutoscalingDataset: {[key: string]: number}[] = [];

    constructor(props: {scaledObjectName: string, namespace:string}) {
        super(props);

        this.state = {
            currentReplicas: 0,
            dataset: []
        }
    }

    async componentDidMount() {
        await this.getCurrentReplicaCount();
        await this.formatData();
        this.setState({dataset: this.replicaAutoscalingDataset});

        try {
            setInterval(async() => {
                await this.getCurrentReplicaCount();
                await this.formatData();
                this.setState({dataset: this.replicaAutoscalingDataset});
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

    formatData() {
        let dataAtTimestamp:{[key:string]: any} = {};
        let date = new Date();
        dataAtTimestamp["timestamp"] = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}-${date.getMinutes()}-${date.getMilliseconds()}`;

        dataAtTimestamp[this.props.scaledObjectName] = this.state.currentReplicas;

        this.replicaAutoscalingDataset.push(dataAtTimestamp);
        
        console.log(this.replicaAutoscalingDataset);
    }
    
    render() {

        return (
            <Paper>
                <Box p={4}>
                    <Typography variant="h6" id="Replica Count">Replicas</Typography>
                    <div style={{ height: 400 }}>
                        <ResponsiveBar
                            data={this.replicaAutoscalingDataset}
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