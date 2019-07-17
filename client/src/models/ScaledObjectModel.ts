// Scaled Object Model interface and constructor
export interface ScaledObjectModel {
    metadata: ScaledObjectMetadata;
    spec: ScaledObjectSpec;
}

export interface ScaledObjectModelConstructor {
    new (metadata: ScaledObjectMetadata, spec: ScaledObjectSpec): ScaledObjectModel;
    clone(): ScaledObjectModel
}

export var ScaledObjectModel: ScaledObjectModelConstructor;

// Scaled Object Metadata interface and constructor
export interface ScaledObjectMetadata {
    name: string;
    namespace: string;
    triggerType: string;
    selfLink: string;
}

export interface ScaledObjectMetadataConstructor {
    new (name: string, namespace: string, triggerType: string, selfLink: string): ScaledObjectMetadata;
    clone(): ScaledObjectMetadata
}
export var ScaledObjectMetadata: ScaledObjectMetadataConstructor;

// Scaled Object Spec and Constructor
export interface ScaledObjectSpec {
    cooldownPeriod: number;
    maxReplicaCount: number;
    minReplicaCount: number;
    pollingInterval: number;
}

export interface ScaledObjectSpecConstructor {
    new (cooldownPeriod: number, maxReplicaCount: number, minReplicaCount: number, pollingInterval: number): ScaledObjectSpec;
    clone(): ScaledObjectSpec
}
export var ScaledObjectSpec: ScaledObjectSpecConstructor;
