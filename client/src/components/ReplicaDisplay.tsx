import React from 'react';
import { Typography } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';
import { ScaledObjectModel } from '../models/ScaledObjectModel';
import { V1Deployment } from '@kubernetes/client-node';

export default class ReplicaDisplay extends React.Component<{}, {currentReplicas: {[key: string]: number}}> {
    replicaAutoscalingDataset: {[key: string]: number}[] = [];

    constructor(props: {}) {
        super(props);

        this.state = {
            currentReplicas: {},
        }
    }

    async componentDidMount() {
        await this.getCurrentReplicaCount();
        await this.formatData();

        try {
            setInterval(async() => {
                await this.getCurrentReplicaCount();
                await this.formatData();
            }, 5000);
        } catch(e) {
            console.log(e);
        }
    }

    async getCurrentReplicaCount() {
        await fetch('/api/scaledobjects')
        .then(res => res.json())
        .then(({ items }) => { 
            let scaledObjects = items; 
            let currentReplicas:{[key: string]: number} = {};

            scaledObjects.map(async (scaledObject:ScaledObjectModel) => {
                await fetch(`/api/deployment/${scaledObject.metadata.name}`)
                .then(res => { return res.json() })
                .then(data => {
                    let deploy = new V1Deployment();
                    deploy.metadata = data.metadata;
                    deploy.spec = data.spec;
                    deploy.status = data.status; 
                    
                    if (deploy.metadata && deploy.metadata!.name) {
                        currentReplicas[deploy.metadata!.name] = (deploy.spec!.replicas === undefined) ? 0:deploy.spec!.replicas;
                    }

                    this.setState({currentReplicas: currentReplicas });
                })
            });
        });
    }

    formatData() {
        let dataAtTimestamp:{[key:string]: any} = {};
        let date = new Date();
        dataAtTimestamp["timestamp"] = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}-${date.getMinutes()}-${date.getMilliseconds()}`;

        for (let deploy in this.state.currentReplicas) {
            dataAtTimestamp[deploy] = this.state.currentReplicas[deploy];
        }

        this.replicaAutoscalingDataset.push(dataAtTimestamp);

        console.log(this.replicaAutoscalingDataset);
    }
    
    render() {
        const data = [
            {
              "timestamp": "AD",
              "hot dog": 155,
              "hot dogColor": "hsl(282, 70%, 50%)",
              "burger": 67,
              "burgerColor": "hsl(20, 70%, 50%)",
              "sandwich": 150,
              "sandwichColor": "hsl(10, 70%, 50%)",
              "kebab": 31,
              "kebabColor": "hsl(66, 70%, 50%)",
              "fries": 103,
              "friesColor": "hsl(147, 70%, 50%)",
              "donut": 99,
              "donutColor": "hsl(16, 70%, 50%)"
            },
            {
              "timestamp": "AE",
              "hot dog": 20,
              "hot dogColor": "hsl(209, 70%, 50%)",
              "burger": 104,
              "burgerColor": "hsl(193, 70%, 50%)",
              "sandwich": 138,
              "sandwichColor": "hsl(111, 70%, 50%)",
              "kebab": 30,
              "kebabColor": "hsl(95, 70%, 50%)",
              "fries": 14,
              "friesColor": "hsl(252, 70%, 50%)",
              "donut": 173,
              "donutColor": "hsl(354, 70%, 50%)"
            },
            {
              "timestamp": "AF",
              "hot dog": 12,
              "hot dogColor": "hsl(62, 70%, 50%)",
              "burger": 119,
              "burgerColor": "hsl(80, 70%, 50%)",
              "sandwich": 121,
              "sandwichColor": "hsl(353, 70%, 50%)",
              "kebab": 187,
              "kebabColor": "hsl(308, 70%, 50%)",
              "fries": 142,
              "friesColor": "hsl(353, 70%, 50%)",
              "donut": 96,
              "donutColor": "hsl(88, 70%, 50%)"
            },
            {
              "timestamp": "AG",
              "hot dog": 153,
              "hot dogColor": "hsl(153, 70%, 50%)",
              "burger": 196,
              "burgerColor": "hsl(125, 70%, 50%)",
              "sandwich": 49,
              "sandwichColor": "hsl(260, 70%, 50%)",
              "kebab": 135,
              "kebabColor": "hsl(81, 70%, 50%)",
              "fries": 22,
              "friesColor": "hsl(56, 70%, 50%)",
              "donut": 23,
              "donutColor": "hsl(6, 70%, 50%)"
            },
            {
              "timestamp": "AI",
              "hot dog": 39,
              "hot dogColor": "hsl(350, 70%, 50%)",
              "burger": 16,
              "burgerColor": "hsl(198, 70%, 50%)",
              "sandwich": 134,
              "sandwichColor": "hsl(129, 70%, 50%)",
              "kebab": 30,
              "kebabColor": "hsl(179, 70%, 50%)",
              "fries": 158,
              "friesColor": "hsl(334, 70%, 50%)",
              "donut": 73,
              "donutColor": "hsl(128, 70%, 50%)"
            },
            {
              "timestamp": "AL",
              "hot dog": 179,
              "hot dogColor": "hsl(226, 70%, 50%)",
              "burger": 39,
              "burgerColor": "hsl(137, 70%, 50%)",
              "sandwich": 63,
              "sandwichColor": "hsl(309, 70%, 50%)",
              "kebab": 118,
              "kebabColor": "hsl(96, 70%, 50%)",
              "fries": 100,
              "friesColor": "hsl(270, 70%, 50%)",
              "donut": 61,
              "donutColor": "hsl(179, 70%, 50%)"
            },
            {
              "timestamp": "AM",
              "hot dog": 136,
              "hot dogColor": "hsl(318, 70%, 50%)",
              "burger": 8,
              "burgerColor": "hsl(238, 70%, 50%)",
              "sandwich": 159,
              "sandwichColor": "hsl(157, 70%, 50%)",
              "kebab": 133,
              "kebabColor": "hsl(326, 70%, 50%)",
              "fries": 82,
              "friesColor": "hsl(357, 70%, 50%)",
              "donut": 88,
              "donutColor": "hsl(231, 70%, 50%)"
            }
        ] 

        return (
            <div>
                <Typography variant="h6" id="Replica Count">Replicas</Typography>
                <div style={{ height: 400 }}>
                <ResponsiveBar
                    data={this.replicaAutoscalingDataset}
                    keys={Object.keys(this.state.currentReplicas)}
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
            </div>
        );
    }
}