import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';

/**
 * Component to search for recipes and display
 * a table of results.
 *
 * @author Brett Batey
 */
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private subscriptions: Array<Subscription> = [];
  private searchState:
    | {
        queryTxt: string;
        mealType: string;
      }
    | undefined;

  // form info
  form: FormGroup | undefined;
  searchTextCtrl: FormControl | undefined;
  mealTypeCtrl: FormControl | undefined;

  constructor(
    public recipeSvc: RecipeService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  /**
   * Initialises the form
   */
  private initForm() {
    this.searchTextCtrl = this.fb.control(null, [
      Validators.required,
      Validators.pattern('[a-zA-Z- ]+'),
    ]);
    this.mealTypeCtrl = this.fb.control(null);
    this.form = this.fb.group({
      searchText: this.searchTextCtrl,
      mealType: this.mealTypeCtrl,
    });
  }

  /**
   * Performs a search of recipes using
   * values from the page form
   * @param page the page number required
   */
  searchRecipes(page: number) {
    const formVal = this.form?.value;
    const query = formVal.searchText;
    const mealType = formVal.mealType;
    this.searchState = { queryTxt: query, mealType: mealType };
    this.subscriptions.push(
      this.recipeSvc.searchRecipes(page, query, mealType).subscribe({
        error: (error: unknown) => {
          console.error('Failed to load recipes!', false);
        },
      })
    );
  }

  viewRecipe(id: string) {
    this.router.navigate(['view', id], {
      state: { search: this.searchState },
    });
  }
}
