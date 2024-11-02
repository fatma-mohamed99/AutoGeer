import { TestBed } from '@angular/core/testing';

import { ProductDataService } from './prduct-data.service';

describe('PrductDataService', () => {
  let service: ProductDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
