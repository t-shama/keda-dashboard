export interface ScaledObjectModel {
    metadata: ScaledObjectMetadata;
    spec: ScaledObjectSpec;
}

export interface ScaledObjectMetadata {
    name: string;
    namespace: string;
    triggerType: string;
    selfLink: string;
}

export interface ScaledObjectSpec {
    cooldownPeriod: number;
    maxReplicaCount: number;
    minReplicaCount: number;
    pollingInterval: number;
    triggers: Trigger[];
}

export interface Trigger {
    type: string;
}