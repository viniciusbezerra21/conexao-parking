import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarVeiculoCard } from './liberar-veiculo-card';

describe('LiberarVeiculoCard', () => {
  let component: LiberarVeiculoCard;
  let fixture: ComponentFixture<LiberarVeiculoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberarVeiculoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarVeiculoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
