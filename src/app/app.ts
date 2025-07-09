import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainSideNav} from './core/main-side-nav/main-side-nav';

@Component({
  selector: 'app-root',
  imports: [MainSideNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'MetaPlan';
}
