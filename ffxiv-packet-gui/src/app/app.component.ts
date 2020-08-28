import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { packetSelector } from 'src/selectors/packet.selector';
import { PacketService } from 'src/services/packet.service';
import { ReceivedPacket } from './app.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  receivedPackets$: Observable<ReceivedPacket[]>;
  sentPackets$: Observable<ReceivedPacket[]>;
  title = 'ffxiv-packet-gui';

  constructor(store: Store<any>, packetService: PacketService) {
    this.receivedPackets$ = store.select(packetSelector.getReceivedPackets);
    this.sentPackets$ = store.select(packetSelector.getPackets);
  }
  
  ngOnInit() {
  }
}
