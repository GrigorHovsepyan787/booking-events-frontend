import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './header.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}