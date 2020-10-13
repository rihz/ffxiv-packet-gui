import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { packetSelector } from 'src/selectors/packet.selector';
import { PacketService } from 'src/services/packet.service';
import { ReceivedPacket } from './app.models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = false;

  packets$: Observable<ReceivedPacket[]>;
  packets: ReceivedPacket[] = [];
  receivedPackets$: Observable<ReceivedPacket[]>;
  sentPackets$: Observable<ReceivedPacket[]>;

  searchQuery = '';
  searchResults: ReceivedPacket[] = [];
  showReceived = true;

  title = 'ffxiv-packet-gui';

  constructor(store: Store<any>, public packetService: PacketService) {
    this.packets$ = store.select(packetSelector.getPackets);
    this.receivedPackets$ = store.select(packetSelector.getReceivedPackets);
    this.sentPackets$ = store.select(packetSelector.getSentPackets);
  }

  get isPaused() {
    return this.packetService.paused;
  }
  
  ngOnInit() {
    this.packets$.subscribe(x => {
      this.packets = x;
    });
  }

  handleCaptureChange(event: MatSlideToggleChange) {
    if(event.checked) {
      this.packetService.resumePacketCapture();
    } else {
      this.packetService.pausePacketCapture();
    }
  }

  search(query: string) {
    this.searchQuery = query;

    if(this.packets) {
      this.isLoading = true;
      this.searchResults = this.packetService.searchPackets(this.packets, query);
      this.isLoading = false;
    }
  }
}
