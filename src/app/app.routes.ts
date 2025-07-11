import { Routes } from '@angular/router';
import {MetaListPageComponent} from './pages/meta-list-page/meta-list-page.component';
import {MetaCreatePageComponent} from './pages/meta-create-page/meta-create-page.component';

export const routes: Routes = [
  {
    path: 'meta-list',
    component: MetaListPageComponent
  },
  {
    path: 'meta-create',
    component: MetaCreatePageComponent
  }
];
