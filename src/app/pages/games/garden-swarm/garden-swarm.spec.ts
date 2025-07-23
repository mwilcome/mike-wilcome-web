import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GardenSwarm } from './garden-swarm';

describe('GardenSwarm', () => {
  let component: GardenSwarm;
  let fixture: ComponentFixture<GardenSwarm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GardenSwarm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GardenSwarm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
