/**
 * A recipe item from a Recipe List search
 */
export interface RecipeListItem {
  id: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  healthScore: number;
}
