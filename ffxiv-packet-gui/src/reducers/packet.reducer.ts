import { Action } from '@ngrx/store';
import { ReceivedPacket } from 'src/app/app.models';

export interface PacketState {
    packets: ReceivedPacket[];
}

export const initialState: PacketState = {
    packets: []
}

export enum PacketActions {
    ADD = '[Packet] Add'
}

export class AddPacket implements Action {
    readonly type = PacketActions.ADD;

    constructor(public readonly packet: ReceivedPacket) {

    }
}

export type PacketAction = AddPacket;

export function packetReducer(
    state: PacketState = initialState,
    action: PacketAction
): PacketState {
    switch (action.type) {
        case PacketActions.ADD:
            state = {
                ...state,
                packets: [...state.packets, action.packet]
            };
            break;
        
        default:
            break;
    }
    
    return state;
}