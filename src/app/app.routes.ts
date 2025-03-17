import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContactComponent } from './contact/contact.component';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
