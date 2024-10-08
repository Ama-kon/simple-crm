import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FollowUpComponent } from './follow-up/follow-up.component';

export const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'user/:id',
    component: UserDetailsComponent,
  },
  {
    path: 'followUp',
    component: FollowUpComponent,
  },
];
