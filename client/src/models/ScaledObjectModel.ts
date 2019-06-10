export interface ScaledObjectModel {
    metadata: ScaledObjectMetadata;
}

export interface ScaledObjectMetadata {
    name: string;
    namespace: string;
    selfLink: string;
}