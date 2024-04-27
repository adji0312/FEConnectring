import { TestBed } from '@angular/core/testing';

import { UsernamecheckService } from './usernamecheck.service';

describe('UsernamecheckService', () => {
  let service: UsernamecheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernamecheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
