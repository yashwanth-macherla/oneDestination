import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quoteapp } from './quoteapp';

describe('Quoteapp', () => {
  let component: Quoteapp;
  let fixture: ComponentFixture<Quoteapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quoteapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quoteapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
