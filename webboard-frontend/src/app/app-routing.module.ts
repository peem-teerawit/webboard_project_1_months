import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ThreadsComponent } from './components/threads/threads.component';
import { ThreadDetailComponent } from './components/thread-detail/thread-detail.component';
import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { ThreadHistoryComponent } from './components/thread-history/thread-history.component';
import { EditThreadComponent } from './components/edit-thread/edit-thread.component';
import { TagThreadComponent } from './components/tag-thread/tag-thread.component';
import { TagComponent } from './components/tag/tag.component';
import { PopularThreadComponent } from './components/popular-thread/popular-thread.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/threads', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'threads', component: ThreadsComponent },
  { path: 'threads/:id', component: ThreadDetailComponent },
  { path: 'create-thread', component: CreateThreadComponent },
  { path: 'thread-history', component: ThreadHistoryComponent },
  { path: 'edit-thread/:id', component: EditThreadComponent },
  { path: 'threads/edit/:id', component: EditThreadComponent },
  { path: 'thread-detail/:id', component: ThreadDetailComponent },
  {path: "tag-thread/:tags", component:TagThreadComponent},
  {path:"tags-summary", component:TagComponent},
  {path: 'popular-thread', component: PopularThreadComponent},
  { path: 'admin/dashboard', component: AdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
