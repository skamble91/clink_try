import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestGraphComponent } from './latest-graph.component';

describe('LatestGraphComponent', () => {
  let component: LatestGraphComponent;
  let fixture: ComponentFixture<LatestGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
