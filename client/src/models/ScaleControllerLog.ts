export class ScaleControllerLog {
    msg: string;
    source: string;
    timestamp: string;
    infoLevel: string;

    constructor(msg: string, source: string, timestamp: string, infoLevel: string) {
        this.msg = msg;
        this.source = source;
        this.timestamp = timestamp;
        this.infoLevel = infoLevel;
    }
}
