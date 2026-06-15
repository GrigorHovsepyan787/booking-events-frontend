import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CreateEventRequest } from '../../models/create-event.request';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private formBuilder = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);

  protected eventForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    eventDate: ['', [Validators.required]],
    location: ['', [Validators.required]],
    capacity: [10, [Validators.required, Validators.min(1)]]
  });

  get form() {
    return this.eventForm.controls;
  }

  protected onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const requestData: CreateEventRequest = this.eventForm.value;
    this.eventService.createEvent(requestData).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }
}