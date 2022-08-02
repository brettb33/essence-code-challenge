import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchCriteria } from 'src/app/shared/models/search-criteria';
import { SortCriteria } from 'src/app/shared/models/sort-criteria';
import { SortDirection } from 'src/app/shared/enums/sort-direction';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { SortType } from 'src/app/shared/enums/sort-type';

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
  loading: boolean = false;
  math = Math;

  // form info
  form: FormGroup | undefined;
  searchTextCtrl: FormControl | undefined;
  mealTypeCtrl: FormControl | undefined;
  dietTypeCtrl: FormControl | undefined;

  // sorting
  sortType = SortType;
  sortDirection = SortDirection;
  sortCriteria: SortCriteria | undefined;

  constructor(
    public recipeSvc: RecipeService,
    private router: Router,
    private fb: FormBuilder,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.pushDataToForm();
    this.sortCriteria = this.recipeSvc.sortCriteria;
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
    this.dietTypeCtrl = this.fb.control(null);
    this.form = this.fb.group({
      searchText: this.searchTextCtrl,
      mealType: this.mealTypeCtrl,
      dietType: this.dietTypeCtrl,
    });
  }

  /**
   * Populates the form if we have existing
   * search criteria
   */
  private pushDataToForm() {
    if (this.recipeSvc.searchCriteria) {
      this.form?.patchValue(this.recipeSvc.searchCriteria);
    }
  }

  /**
   * Sorts on a particular table column
   * (currently just Health Score and Calories)
   *
   * @param sortType
   */
  sortOn(sortType: SortType) {
    let sortDir = SortDirection.DESCENDING;
    if (this.sortCriteria) {
      // we are already sorting
      if (this.sortCriteria.sortOn === sortType) {
        // need to change the direction
        sortDir =
          this.sortCriteria.sortDirection === SortDirection.ASCENDING
            ? SortDirection.DESCENDING
            : SortDirection.ASCENDING;
      }
    }
    this.sortCriteria = new SortCriteria(sortType, sortDir);
    this.searchRecipes(0);
  }

  /**
   * Performs a search of recipes using
   * values from the page form
   * @param page the page number required
   */
  searchRecipes(page: number) {
    this.loading = true;
    const formVal = this.form?.value;
    const searchCriteria = new SearchCriteria(
      formVal.searchText,
      formVal.mealType,
      formVal.dietType
    );
    this.subscriptions.push(
      this.recipeSvc
        .searchRecipes(page, searchCriteria, this.sortCriteria)
        .subscribe({
          next: () => (this.loading = false),
          error: () => {
            this.loading = false;
            console.error('Failed to load recipes!', false);
          },
        })
    );
  }

  viewRecipe(id: string) {
    this.router.navigate(['view', id]);
  }

  logout() {
    this.recipeSvc.clearRecipeList();
    this.authSvc.logout();
    this.router.navigate(['auth']);
  }
}
