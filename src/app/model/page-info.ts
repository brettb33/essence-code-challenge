/**
 * Paging information for pagination
 *
 * pageNumber: the current page number
 * offset: the number of results to skip
 * totalPages: the total number of pages found
 * totalResults: the total number of results found
 */
export class PageInfo {
  constructor(
    public pageNumber: number,
    public offset: number,
    public totalPages: number,
    public totalResults: number
  ) {}
}
