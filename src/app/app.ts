import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Quoteapp } from "./quoteapp/quoteapp";
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Quoteapp, RouterLink, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('quotegen');
}
