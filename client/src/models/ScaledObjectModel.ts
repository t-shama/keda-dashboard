// Scaled Object Model interface and constructor
export class ScaledObjectModel {
    metadata: ScaledObjectMetadata;
    spec: ScaledObjectSpec;
    triggers: ScaledObjectTriggers;
    status: ScaledObjectStatus;

    constructor(metadata: ScaledObjectMetadata, spec: ScaledObjectSpec, triggers: ScaledObjectTriggers, status: ScaledObjectStatus) {
        this.metadata = metadata;
        this.spec = spec;
        this.triggers = triggers;
        this.status = status;
    }
}

// Scaled Object Metadata interface and constructor
export class ScaledObjectMetadata {
    name: string;
    namespace: string;
    triggerType: string;
    selfLink: string;

    constructor(name: string, namespace: string, triggerType: string, selfLink: string) {
        this.name = name;
        this.namespace = namespace;
        this.triggerType = triggerType;
        this.selfLink = selfLink;
    }
}

// Scaled Object Spec and Constructor
export class ScaledObjectSpec {
    cooldownPeriod: number;
    maxReplicaCount: number;
    minReplicaCount: number;
    pollingInterval: number;
    triggers: ScaledObjectTriggers[];
    scaleTargetRef: {[key:string]: string};
    
    constructor(cooldownPeriod: number, maxReplicaCount: number, minReplicaCount: number, pollingInterval: number, triggers: ScaledObjectTriggers[], scaleTargetRef: {[key:string]: string}) {
        this.cooldownPeriod = cooldownPeriod;
        this.maxReplicaCount = maxReplicaCount;
        this.minReplicaCount = minReplicaCount;
        this.pollingInterval = pollingInterval;
        this.triggers = triggers;
        this.scaleTargetRef = scaleTargetRef;
    }
}

export class ScaledObjectTriggers {
    type: string;
    metadata: {[key: string]: string};

    constructor(type: string, metadata: {[key: string]: string}) {
        this.type = type;
        this.metadata = metadata;
    }
}

export class ScaledObjectStatus {
    currentReplicas: number;
    desiredReplicas: number;
    lastActiveTime: string;

    constructor(currentReplicas: number, desiredReplicas: number, lastActiveTime: string) {
        this.currentReplicas = currentReplicas;
        this.desiredReplicas = desiredReplicas;
        this.lastActiveTime = lastActiveTime;
    }
}