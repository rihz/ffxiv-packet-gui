import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketCardComponent } from './packet-card.component';

describe('PacketCardComponent', () => {
  let component: PacketCardComponent;
  let fixture: ComponentFixture<PacketCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacketCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
