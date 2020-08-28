import { PacketState, packetReducer } from './packet.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface IAppState {
    packets: PacketState
}

export const reducers: ActionReducerMap<IAppState> = {
    packets: packetReducer
}