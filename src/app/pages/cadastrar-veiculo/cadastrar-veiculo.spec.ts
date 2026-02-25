import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarVeiculo } from './cadastrar-veiculo';

describe('CadastrarVeiculo', () => {
  let component: CadastrarVeiculo;
  let fixture: ComponentFixture<CadastrarVeiculo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarVeiculo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarVeiculo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
