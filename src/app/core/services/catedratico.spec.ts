import { TestBed } from '@angular/core/testing';
import { Catedratico } from './catedratico';

describe('Catedratico', () => {
  let service: Catedratico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Catedratico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
