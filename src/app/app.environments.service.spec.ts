import { TestBed, inject } from '@angular/core/testing';

import { AppEnvironmentsService } from './app.environments.service';

describe('AppEnvironmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppEnvironmentsService]
    });
  });

  it('should be created', inject([AppEnvironmentsService], (service: AppEnvironmentsService) => {
    expect(service).toBeTruthy();
  }));
});
