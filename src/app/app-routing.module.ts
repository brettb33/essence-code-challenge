import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeItemComponent } from './components/recipe-item/recipe-item.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    component: SearchPageComponent,
    //  canActivate: [AuthGuard],
  },
  {
    path: 'view/:id',
    component: RecipeItemComponent,
    //  canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
