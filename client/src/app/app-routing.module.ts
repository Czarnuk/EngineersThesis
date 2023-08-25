import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrepareListComponent } from './prepare/prepare-list/prepare-list.component';
import { CertifyListComponent } from './certify/certify-list/certify-list.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'prepare', component: PrepareListComponent, },
      { path: 'certify', component: CertifyListComponent },
      { path: 'contact', component: ContactComponent },
    ]
  },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
