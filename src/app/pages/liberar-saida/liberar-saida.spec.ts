import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarSaida } from './liberar-saida';

describe('LiberarSaida', () => {
  let component: LiberarSaida;
  let fixture: ComponentFixture<LiberarSaida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberarSaida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarSaida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
