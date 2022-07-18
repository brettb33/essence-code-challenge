import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RecipeItemDetail } from '../model/recipe-item-detail';
import { RecipeListItem } from '../model/recipe-list-item';
import { RecipeListResponseType } from '../model/recipe-list-response-type';
import { SearchCriteria } from '../model/search-criteria';
import { SortCriteria } from '../model/sort-criteria';

/**
 * Service to interact with the Spoonacular public API
 * https://spoonacular.com/food-api/docs to get Recipe
 * information.
 *
 * @author Brett Batey
 */
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly url: string = 'https://api.spoonacular.com/recipes';
  private readonly apiKey = '66f014cb70f940b8ac05ea32a4ffa8cb';

  // URL paths for a particular search call
  private readonly complexSearchPath = '/complexSearch';
  private readonly infoPath = '/information';

  // meal types used to filter search
  readonly mealTypes: Array<string> = [
    'breakfast',
    'soup',
    'main course',
    'dessert',
    'drink',
    'snack',
  ];

  // parameter constants
  readonly paramQuery = 'query';
  readonly paramApiKey = 'apiKey';
  readonly paramPageSize = 'number';
  readonly paramOffset = 'offset';
  readonly paramAddRecipeInfo = 'addRecipeInformation';
  readonly paramMealType = 'type';
  readonly paramSortOn = 'sort';
  readonly paramSortDir = 'sortDirection';

  // paging info
  readonly pageSize: number = 10;
  private totalResults: number = 0;
  pageNumber: number = 0;
  offset: number = 0;
  totalPages: number = 0;

  // search criteria
  searchCriteria: SearchCriteria | undefined;

  // sort criteria
  private sortCriteria: SortCriteria | undefined;

  private _searchResults: Array<RecipeListItem> = [];

  constructor(private httpClient: HttpClient) {}

  get recipeList(): Array<RecipeListItem> {
    return this._searchResults.slice();
  }

  /**
   * Clears the recipe list information
   * e.g. when we logout
   */
  clearRecipeList() {
    this._searchResults = [];
    this.totalResults = 0;
    this.offset = 0;
    this.totalPages = 0;
    this.searchCriteria = undefined;
    this.sortCriteria = undefined;
  }

  /**
   * Performs a complex search for recipes
   * @param pageNo the page number required
   * @param query the search query text
   * @param mealType the meal type filter
   * @returns an {@link Observable} of a
   * {@link RecipeListResponseType} object
   */
  searchRecipes(
    pageNo: number,
    searchCriteria: SearchCriteria,
    sortCriteria?: SortCriteria
  ): Observable<RecipeListResponseType> {
    this.pageNumber = pageNo;
    this.searchCriteria = searchCriteria;
    this.sortCriteria = sortCriteria;

    return this.httpClient
      .get<RecipeListResponseType>(this.url + this.complexSearchPath, {
        params: this.getSearchParams(),
      })
      .pipe(
        map((response: RecipeListResponseType) => {
          this._searchResults = response.results;
          this.totalResults = response.totalResults;
          this.totalPages = Math.ceil(this.totalResults / this.pageSize);
          this.offset = response.offset;
          return response;
        })
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets {@link HttpParams} from searching,
   * sorting and paging information
   * @returns {@link HttpParams} to search with
   */
  private getSearchParams(): HttpParams {
    let params = new HttpParams();

    if (this.searchCriteria) {
      params = params.set(this.paramQuery, this.searchCriteria.searchText);
      params = params.set(this.paramApiKey, this.apiKey);
      params = params.set(this.paramPageSize, this.pageSize);
      params = params.set(this.paramOffset, this.pageNumber * this.pageSize);
      params = params.set(this.paramAddRecipeInfo, true);

      // add the meal type filter if set
      if (this.searchCriteria.mealType) {
        params = params.set(this.paramMealType, this.searchCriteria.mealType);
      }

      // add sorting if set
      if (this.sortCriteria) {
        params = params.set(this.paramSortOn, this.sortCriteria.sortOn);
        params = params.set(this.paramSortDir, this.sortCriteria.sortDirection);
      }
    }
    return params;
  }

  /**
   * Gets specific recipe information
   * @param recipeId the Id of the recipe
   * @returns an {@link Observable} containing the
   * {@link RecipeItemDetail} object
   */
  getRecipe(recipeId: string): Observable<RecipeItemDetail> {
    let params = new HttpParams();
    params = params.set('includeNutrition', false);
    params = params.set('apiKey', this.apiKey);
    return this.httpClient
      .get<RecipeItemDetail>(this.url + '/' + recipeId + this.infoPath, {
        params: params,
      })
      .pipe(
        map((data: RecipeItemDetail) => {
          return data;
        })
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Convenience method to handle errors.
   *
   * @param error the {@link HttpErrorResponse}
   * @returns a friendlier error message as an {@link Observable}
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    return throwError(() => {
      return error;
    });
  }
}
