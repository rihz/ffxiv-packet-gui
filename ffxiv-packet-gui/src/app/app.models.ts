export class RawPacket {
    type: string = '';
    connection: string = '';
    operation: string = '';
    epoch: number = 0;
    packetSize: number = 0;
    segmentType: number = 0;
    data: Uint8Array;
    dataUint16: Uint16Array;
    dataUint32: Uint32Array;
    dataInt16: Int16Array;
    dataInt32: Int32Array;
    dataString: string;
    superType: string = '';
    soureActorSessionID: number = 0;
    targetActorSessionID: number = 0;
    serverID: number = 0;
    timestamp: number = 0;
}

export class ReceivedPacket {
    id: number = 0;
    packet: RawPacket = new RawPacket();
}