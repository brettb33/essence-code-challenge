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
  private readonly token = '66f014cb70f940b8ac05ea32a4ffa8cb';

  // URL paths for a particular search call
  private readonly complexSearchPath = '/complexSearch';
  private readonly infoPath = '/information';
  private readonly nutritionPath = '/nutritionWidget';

  // meal types used to filter search
  readonly mealTypes: Array<string> = [
    'breakfast',
    'soup',
    'main course',
    'dessert',
    'drink',
    'snack',
  ];

  // paging info
  readonly pageSize: number = 10;
  totalResults: number = 0;
  pageNumber: number = 0;
  offset: number = 0;
  totalPages: number = 0;

  // html content type for the nutrition widget
  private htmlContentTypeHeader = {
    headers: new HttpHeaders({
      responseType: 'text',
    }),
  };

  private _searchResults: Array<RecipeListItem> = [];

  constructor(private httpClient: HttpClient) {}

  get recipeList(): Array<RecipeListItem> {
    return this._searchResults.slice();
  }

  /**
   *Performs a complex search for recipes
   * @param pageNo the page number required
   * @param query the search query text
   * @param mealType the meal type filter
   * @returns an {@link Observable} of a
   * {@link RecipeListResponseType} object
   */
  searchRecipes(
    pageNo: number,
    query: string,
    mealType?: string
  ): Observable<RecipeListResponseType> {
    this.pageNumber = pageNo;

    // set the search parameters as HttpParams
    let params = new HttpParams();
    params = params.set('query', query);
    params = params.set('apiKey', this.token);
    params = params.set('number', this.pageSize);
    params = params.set('offset', this.pageNumber * this.pageSize);
    params = params.set('addRecipeInformation', true);

    // add the meal type filter if set
    if (mealType) {
      params = params.set('type', mealType);
    }

    return this.httpClient
      .get<RecipeListResponseType>(this.url + this.complexSearchPath, {
        params: params,
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
   * Gets specific recipe information
   * @param recipeId the Id of the recipe
   * @returns an {@link Observable} containing the
   * {@link RecipeItemDetail} object
   */
  getRecipe(recipeId: string): Observable<RecipeItemDetail> {
    let params = new HttpParams();
    params = params.set('includeNutrition', false);
    params = params.set('apiKey', this.token);
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
