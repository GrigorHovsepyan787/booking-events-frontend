import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      get: () => ({ subscribe: (cb: any) => cb([]) }),
      patch: () => ({ subscribe: (cb: any) => cb({}) }),
      delete: () => ({ subscribe: (cb: any) => cb(undefined) })
    };
    service = new NotificationService(mockHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
