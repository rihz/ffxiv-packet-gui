import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PacketState } from 'src/reducers/packet.reducer';

const getState = createFeatureSelector<PacketState>('packets');

const getPackets = createSelector(
    getState,
    (state: PacketState) => state.packets
);

const getSentPackets = createSelector(
    getState,
    (state: PacketState) => state.packets.filter(x => x.packet.operation === 'send')
);

const getReceivedPackets = createSelector(
    getState,
    (state: PacketState) => state.packets.filter(x => x.packet.operation === 'receive')
);

export const packetSelector = {
    getPackets,
    getSentPackets,
    getReceivedPackets
};