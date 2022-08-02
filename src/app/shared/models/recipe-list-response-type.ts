import { RecipeListItem } from './recipe-list-item';

/**
 * The Recipe List Response Type received from calling Spoonacular's
 * complex search RESTful API GET method
 */
export interface RecipeListResponseType {
  offset: number;
  number: number;
  results: Array<RecipeListItem>;
  totalResults: number;
}
