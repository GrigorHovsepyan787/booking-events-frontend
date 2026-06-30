import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  type = input<string>('button');
  href = input<string | null>(null);
  routerLink = input<string | string[] | null>(null);
  click = output<void>();

  get buttonClass(): string {
    const baseClass = 'btn';
    const variantClass = `btn-${this.variant()}`;
    return `${baseClass} ${variantClass}`;
  }
}