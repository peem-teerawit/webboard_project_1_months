import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ThreadsComponent } from './components/threads/threads.component';
import { ThreadDetailComponent } from './components/thread-detail/thread-detail.component';
import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { ThreadHistoryComponent } from './components/thread-history/thread-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/threads', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'threads', component: ThreadsComponent },
  { path: 'threads/:id', component: ThreadDetailComponent },
  { path: 'create-thread', component: CreateThreadComponent },
  { path: 'thread-history', component: ThreadHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
