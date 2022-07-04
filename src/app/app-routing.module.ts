import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeItemComponent } from './components/recipe-item/recipe-item.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    component: SearchPageComponent,
  },
  {
    path: 'view/:id',
    component: RecipeItemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
