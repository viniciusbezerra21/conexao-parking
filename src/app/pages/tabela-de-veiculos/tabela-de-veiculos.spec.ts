import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaDeVeiculos } from './tabela-de-veiculos';

describe('TabelaDeVeiculos', () => {
  let component: TabelaDeVeiculos;
  let fixture: ComponentFixture<TabelaDeVeiculos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaDeVeiculos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaDeVeiculos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
