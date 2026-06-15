import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from '../layouts/footer.component';
import { HeaderComponent } from '../layouts/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}