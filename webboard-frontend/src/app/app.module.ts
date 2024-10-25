import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ThreadsComponent } from './components/threads/threads.component';
import { ThreadDetailComponent } from './components/thread-detail/thread-detail.component';
import { CreateThreadComponent } from './components/create-thread/create-thread.component';
import { EditThreadComponent } from './components/edit-thread/edit-thread.component';
import { TagComponent } from './components/tag/tag.component';
import { TagThreadComponent } from './components/tag-thread/tag-thread.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ThreadHistoryComponent } from './components/thread-history/thread-history.component';
import { PopularThreadComponent } from './components/popular-thread/popular-thread.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ThreadsComponent,
    ThreadDetailComponent,
    CreateThreadComponent,
    EditThreadComponent,
    TagComponent,
    TagThreadComponent,
    ThreadHistoryComponent,
    PopularThreadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
