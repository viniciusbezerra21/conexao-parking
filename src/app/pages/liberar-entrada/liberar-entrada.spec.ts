import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarEntrada } from './liberar-entrada';

describe('LiberarEntrada', () => {
  let component: LiberarEntrada;
  let fixture: ComponentFixture<LiberarEntrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberarEntrada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarEntrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
