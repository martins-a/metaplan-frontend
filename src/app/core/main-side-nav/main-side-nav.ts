import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {Router, RouterOutlet} from '@angular/router';
import {MenuItem} from '../../models/menu-items';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-main-side-nav',
  imports: [MatSidenavModule, RouterOutlet, MatListModule, MatIconModule],
  templateUrl: './main-side-nav.html',
  styleUrl: './main-side-nav.scss',
  standalone: true
})
export class MainSideNav {

  menuItems: MenuItem[] = [
    { name: 'Meta', route: '/meta-list', icon: 'flag' },
    { name: 'Planejamento', route: '/planejamento', icon: 'event_note' },
    { name: 'Gastos Fixos', route: '/gastos-fixos', icon: 'receipt' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
