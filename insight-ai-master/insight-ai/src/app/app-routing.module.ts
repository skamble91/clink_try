import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { MainPageComponent } from './components/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'chat', component: MainPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
