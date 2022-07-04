/**
 * An item from a Recipe List
 */
export interface RecipeListItem {
  id: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  healthScore: number;
}
