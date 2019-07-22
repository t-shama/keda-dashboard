// Scaled Object Model interface and constructor
export class ScaledObjectModel {
    metadata: ScaledObjectMetadata;
    spec: ScaledObjectSpec;
    triggers: ScaledObjectTriggers;
    status: ScaledObjectStatus;

    constructor(metadata: ScaledObjectMetadata=new ScaledObjectMetadata(), spec: ScaledObjectSpec=new ScaledObjectSpec(), 
                triggers: ScaledObjectTriggers=new ScaledObjectTriggers(), status: ScaledObjectStatus=new ScaledObjectStatus()) {
        this.metadata = metadata;
        this.spec = spec;
        this.triggers = triggers;
        this.status = status;
    }
}

// Scaled Object Metadata interface and constructor
export class ScaledObjectMetadata {
    annotations: string[]
    name: string;
    namespace: string;
    triggerType: string;
    selfLink: string;

    constructor(annotations: string[]=[], name: string="", namespace: string="", triggerType: string="", selfLink: string="") {
        this.annotations = annotations;
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
    
    constructor(cooldownPeriod: number=0, maxReplicaCount: number=0, minReplicaCount: number=0, pollingInterval: number=0, triggers: ScaledObjectTriggers[]=[], scaleTargetRef: {[key:string]: string}={}) {
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

    constructor(type: string="", metadata: {[key: string]: string}={}) {
        this.type = type;
        this.metadata = metadata;
    }
}

export class ScaledObjectStatus {
    currentReplicas: number;
    desiredReplicas: number;
    lastActiveTime: string;

    constructor(currentReplicas: number=0, desiredReplicas: number=0, lastActiveTime: string="") {
        this.currentReplicas = currentReplicas;
        this.desiredReplicas = desiredReplicas;
        this.lastActiveTime = lastActiveTime;
    }
}