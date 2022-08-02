import { SortDirection } from '../enums/sort-direction';
import { SortType } from '../enums/sort-type';

/**
 * Class to hold search sort settings
 */
export class SortCriteria {
  constructor(public sortOn: SortType, public sortDirection: SortDirection) {}
}
