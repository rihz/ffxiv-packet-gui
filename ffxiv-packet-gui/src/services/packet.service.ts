import { Injectable, NgZone } from "@angular/core";

import { IpcRenderer, IpcRendererEvent } from 'electron';
import { Router } from '@angular/router';
import { Store, createAction, props } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { packetSelector } from 'src/selectors/packet.selector';
import { PacketActions, AddPacket } from 'src/reducers/packet.reducer';

type EventCallback = (event: IpcRendererEvent, ...args: any[]) => void;

@Injectable({
    providedIn: 'root'
})
export class PacketService {
    private readonly _renderer: IpcRenderer | undefined = undefined;

    public get ready(): boolean {
        return this._renderer !== undefined;
    }

    public packets$: Observable<any>;

    constructor(private router: Router, private store: Store<any>, private zone: NgZone) {
        if(window.require) {
            try {
                this._renderer = window.require('electron').ipcRenderer;
                this._renderer.setMaxListeners(0);
                this.addListeners();
            } catch(e) {
                throw e;
            }
        } else {
            console.warn('No IPC loaded!');
        }
    }

    public on(channel: string, callback: EventCallback) {
        if(this.ready) {
            this._renderer.on(channel, (event, ...args) => {
                this.zone.run(() => callback(event, ...args));
            });
        }
    }

    private addListeners(): void {
        console.log('addListeners');
        this.on('packet', (event, packet: any) => {
            console.log('received packet');
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
        console.log('handling', packet);
        this.store.dispatch(new AddPacket(packet));
    }
}