import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeItemDetail } from 'src/app/model/recipe-item-detail';
import { SearchCriteria } from 'src/app/model/search-criteria';
import { RecipeService } from 'src/app/services/recipe.service';

/**
 * Component to view a Recipe
 *
 * @author Brett Batey
 */
@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  private subscriptions: Array<Subscription> = [];
  recipe: RecipeItemDetail | undefined;
  nutritionImagePath: string | undefined;
  private searchCriteria: SearchCriteria | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeSvc: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        const recipeId = params['id'];
        this.loadRecipe(recipeId);
        this.nutritionImagePath = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.png?apiKey=66f014cb70f940b8ac05ea32a4ffa8cb`;
      }
    });
  }

  returnToResults() {
    this.router.navigate(['list']);
  }

  /**
   * Loads a recipe from the recipe service
   * @param id the id of the recipe to load
   */
  loadRecipe(id: string) {
    this.subscriptions.push(
      this.recipeSvc.getRecipe(id).subscribe({
        next: (recipe: RecipeItemDetail) => {
          this.recipe = recipe;
        },
        error: (error: unknown) => {
          console.error('Failed to load recipe!', false);
        },
      })
    );
  }
}
