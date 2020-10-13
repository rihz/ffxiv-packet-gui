import { Injectable, NgZone } from "@angular/core";

import { IpcRenderer, IpcRendererEvent } from 'electron';
import { Router } from '@angular/router';
import { Store, createAction, props } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { packetSelector } from 'src/selectors/packet.selector';
import { PacketActions, AddPacket } from 'src/reducers/packet.reducer';
import { ReceivedPacket } from 'src/app/app.models';

type EventCallback = (event: IpcRendererEvent, ...args: any[]) => void;

@Injectable({
    providedIn: 'root'
})
export class PacketService {
    private readonly _renderer: IpcRenderer | undefined = undefined;

    private _paused: boolean = false;

    public get paused(): boolean {
        return this._paused;
    }

    public get ready(): boolean {
        return this._renderer !== undefined;
    }

    public packets$: Observable<any>;

    constructor(private router: Router, private store: Store<any>, private zone: NgZone) {
        if (window.require) {
            try {
                this._renderer = window.require('electron').ipcRenderer;
                this._renderer.setMaxListeners(0);
                this.addListeners();
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('No IPC loaded!');
        }
    }

    public on(channel: string, callback: EventCallback) {
        if (this.ready) {
            this._renderer.on(channel, (event, ...args) => {
                this.zone.run(() => callback(event, ...args));
            });
        }
    }

    public pausePacketCapture() {
        if (this.ready) {
            this._paused = true;
        }
    }

    public resumePacketCapture() {
        if (this.ready) {
            this._paused = false;
        }
    }

    public searchPackets(packets: ReceivedPacket[], query: string): ReceivedPacket[] {
        let results: ReceivedPacket[] = [];

        if(isNaN(parseInt(query))) {
            results = packets.filter(x => {
                return x.packet.dataString.indexOf(query) > -1;
            });
        } else {
            results = packets.filter(x => {
                return x.packet.dataString.indexOf(query) > -1
                || x.packet.dataInt16.findIndex(y => y.toString().indexOf(query) > -1) > -1
                || x.packet.dataInt32.findIndex(y => y.toString().indexOf(query) > -1) > -1
                || x.packet.dataUint16.findIndex(y => y.toString().indexOf(query) > -1) > -1
                || x.packet.dataUint32.findIndex(y => y.toString().indexOf(query) > -1) > -1
            });
        }

        return results;
    }

    private addListeners(): void {
        this.on('packet', (event, packet: any) => {
            this.handlePacket(packet);
        });
    }

    private handlePacket(packet: any) {
        const action = createAction(
            PacketActions.ADD,
            props<{
                packet: any
            }>()
        );

        if(!this._paused) {
            this.store.dispatch(new AddPacket(packet));
        }
    }
}