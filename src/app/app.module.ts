import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { RecipeItemComponent } from './components/recipe-item/recipe-item.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PagingComponent } from './components/common/paging/paging.component';

@NgModule({
  declarations: [AppComponent, SearchPageComponent, RecipeItemComponent, PagingComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
