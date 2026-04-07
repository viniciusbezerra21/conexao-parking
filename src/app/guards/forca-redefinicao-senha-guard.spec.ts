import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { forcaRedefinicaoSenhaGuard } from './forca-redefinicao-senha-guard';

describe('forcaRedefinicaoSenhaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => forcaRedefinicaoSenhaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
