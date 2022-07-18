import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { RecipeItemComponent } from './components/recipe-item/recipe-item.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'list',
    component: SearchPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:id',
    component: RecipeItemComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
