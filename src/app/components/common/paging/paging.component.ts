import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css'],
})
export class PagingComponent implements OnInit {
  @Output('parentSearch') parentSearch: EventEmitter<number> =
    new EventEmitter();

  constructor(public recipeSvc: RecipeService) {}

  ngOnInit(): void {}

  search(pageNumber: number) {
    this.parentSearch.emit(pageNumber);
  }
}
