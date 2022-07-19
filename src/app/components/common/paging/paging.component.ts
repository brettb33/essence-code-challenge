import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageInfo } from 'src/app/model/page-info';
import { RecipeService } from 'src/app/services/recipe.service';

/**
 * Generic paging component that takes a {@link PageInfo} object
 * from its parent to update current paging information. Also emits
 * a page number to its parent to search for a specific page.
 */
@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css'],
})
export class PagingComponent implements OnInit {
  @Output('parentSearch') parentSearch: EventEmitter<number> =
    new EventEmitter();
  @Input('pageInfo') pageInfo: PageInfo = new PageInfo(0, 0, 0, 0);

  constructor(public recipeSvc: RecipeService) {}

  ngOnInit(): void {}

  search(pageNumber: number) {
    this.parentSearch.emit(pageNumber);
  }
}
