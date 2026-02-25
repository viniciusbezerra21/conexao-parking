import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiculosCadastrados } from './veiculos-cadastrados';

describe('VeiculosCadastrados', () => {
  let component: VeiculosCadastrados;
  let fixture: ComponentFixture<VeiculosCadastrados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiculosCadastrados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiculosCadastrados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
