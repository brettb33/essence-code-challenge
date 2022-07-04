import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecipeItemDetail } from '../model/recipe-item-detail';
import { RecipeListResponseType } from '../model/recipe-list-response-type';

import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let controller: HttpTestingController;

  let baseUrl: string = 'https://api.spoonacular.com/recipes';
  let token = '66f014cb70f940b8ac05ea32a4ffa8cb';

  // URL paths for a particular search call
  let complexSearchPath = '/complexSearch';
  let infoPath = '/information';

  const recipeItemId = '716342';

  const expectedSearchUrl = `${baseUrl}${complexSearchPath}?query=&apiKey=${token}&number=10&offset=0&addRecipeInformation=true`;
  const expectedGetRecipeUrl = `${baseUrl}/${recipeItemId}${infoPath}?includeNutrition=false&apiKey=${token}`;

  const mockRecipeListResponse: RecipeListResponseType = {
    offset: 10,
    number: 0,
    results: [
      {
        id: '637876',
        title: 'Chicken 65',
        readyInMinutes: 45,
        servings: 4,
        vegetarian: false,
        healthScore: 80,
      },
      {
        id: '716342',
        title: 'Chicken Suya',
        readyInMinutes: 35,
        servings: 2,
        vegetarian: false,
        healthScore: 76,
      },
      {
        id: '638308',
        title: 'Chicken Satay',
        readyInMinutes: 50,
        servings: 4,
        vegetarian: false,
        healthScore: 65,
      },
    ],
    totalResults: 3,
  };

  const mockRecipeItemDetail: RecipeItemDetail = {
    title: 'Chicken Satay',
    summary: 'Chicken Satay summary description',
    image: 'image information',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RecipeService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('gets a list of recipes', () => {
    let actualRecipeListResponse!: RecipeListResponseType;
    service.searchRecipes(0, '').subscribe((response) => {
      actualRecipeListResponse = response;
    });

    const request = controller.expectOne(expectedSearchUrl);
    request.flush(mockRecipeListResponse);
    controller.verify();

    expect(actualRecipeListResponse).toEqual(mockRecipeListResponse);
  });

  it('passes through erors when searching recipes', () => {
    const mockError = new ProgressEvent('API error');

    service.searchRecipes(0, '').subscribe({
      next: () => {
        fail('next handler must not be called');
      },
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
      },
      complete: () => {
        fail('complete handler must not be called');
      },
    });

    const req = controller.expectOne(expectedSearchUrl);
    req.error(mockError);
  });

  it('gets a recipe with an id', () => {
    let actualRecipeItem!: RecipeItemDetail;
    service.getRecipe(recipeItemId).subscribe((response) => {
      actualRecipeItem = response;
    });

    const request = controller.expectOne(expectedGetRecipeUrl);
    request.flush(mockRecipeItemDetail);
    controller.verify();

    expect(actualRecipeItem).toEqual(mockRecipeItemDetail);
  });

  it('passes through errors when getting a recipe with an id', () => {
    const mockError = new ProgressEvent('API error');

    service.getRecipe(recipeItemId).subscribe({
      next: () => {
        fail('next handler must not be called');
      },
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
      },
      complete: () => {
        fail('complete handler must not be called');
      },
    });

    const req = controller.expectOne(expectedGetRecipeUrl);
    req.error(mockError);
  });
});
