import { SortDirection } from './sort-direction';
import { SortType } from './sort-type';

/**
 * Class to hold search sort settings
 */
export class SortCriteria {
  constructor(public sortOn: SortType, public sortDirection: SortDirection) {}
}
