import { EventForm } from './event-form';
import { FormBuilder } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

describe('EventForm', () => {
  let component: EventForm;
  let formBuilder: any;
  let eventService: any;
  let router: any;

  beforeEach(() => {
    formBuilder = {
      group: () => ({
        controls: {},
        invalid: false,
        markAllAsTouched: () => {},
        value: {}
      })
    };
    eventService = {};
    router = { navigate: () => {} };

    component = new EventForm(formBuilder as any, eventService, router);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
