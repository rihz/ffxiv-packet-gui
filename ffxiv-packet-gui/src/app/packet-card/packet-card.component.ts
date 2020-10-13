import { Component, OnInit, Input } from '@angular/core';
import { RawPacket, ReceivedPacket } from '../app.models';
import { AddPacket } from 'src/reducers/packet.reducer';

@Component({
  selector: 'app-packet-card',
  templateUrl: './packet-card.component.html',
  styleUrls: ['./packet-card.component.scss']
})
export class PacketCardComponent implements OnInit {
  @Input() packet: ReceivedPacket;
  @Input() toHighlight: string = '';

  get dataChar() : string[] {
    return this.packet.packet.dataString.split("");
  }

  get timestamp(): Date {
    return this.packet.packet.epoch
      ? new Date(this.packet.packet.epoch)
      : null;
  }
  
  constructor() { }

  ngOnInit() {
    
  }

  shouldHighlightCell(item: string) {
    return this.toHighlight !== ''
      ? item == this.toHighlight
      : false;
  }

}
