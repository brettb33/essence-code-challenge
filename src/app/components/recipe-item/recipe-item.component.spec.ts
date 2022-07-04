import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RecipeItemDetail } from 'src/app/model/recipe-item-detail';
import { RecipeService } from 'src/app/services/recipe.service';

import { RecipeItemComponent } from './recipe-item.component';

const mockRecipeItemDetail: RecipeItemDetail = {
  title: 'Chicken Satay',
  summary: 'Chicken Satay summary description',
  image: 'image information',
};

describe('RecipeItemComponent', () => {
  let component: RecipeItemComponent;
  let mockRecipeSvc: RecipeService;
  let fixture: ComponentFixture<RecipeItemComponent>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    mockRecipeSvc = jasmine.createSpyObj<RecipeService>('RecipeService', {
      getRecipe: of(mockRecipeItemDetail),
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [RecipeItemComponent],
      providers: [
        { provide: RecipeService, useValue: mockRecipeSvc },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: '1234',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recipe information on startup', () => {
    const loadRecipeSpy = spyOn<any>(component, 'loadRecipe');
    routerSpy.navigate;
    component.ngOnInit();
    expect(loadRecipeSpy).toHaveBeenCalledOnceWith('1234');
  });

  it('should retrieve a recipe through the Recipe Service', () => {
    component.loadRecipe('1234');
    expect(mockRecipeSvc.getRecipe).toHaveBeenCalled();
    mockRecipeSvc.getRecipe('1234').subscribe((response) => {
      expect(response).toEqual(mockRecipeItemDetail);
    });
  });

  it('navigates back to the list page', () => {
    component.returnToResults();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['list']);
  });
});
