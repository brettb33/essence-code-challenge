import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PageInfo } from 'src/app/shared/models/page-info';

import { PagingComponent } from './paging.component';

describe('PagingComponent', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PagingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only disables the First and Previous links when it is the first page', () => {
    // check links are disabled when it is the first page
    component.pageInfo = new PageInfo(0, 14, 1, 15);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const firstLink = debugElement.query(By.css('[testId="first-link"]'));
    const previousLink = debugElement.query(By.css('[testId="previous-link"]'));

    expect(firstLink.nativeElement.parentElement.className).toBe(
      'page-item disabled'
    );
    expect(previousLink.nativeElement.parentElement.className).toBe(
      'page-item disabled'
    );

    // check links are NOT disabled when it is NOT the first page
    component.pageInfo = new PageInfo(1, 29, 2, 30);
    fixture.detectChanges();

    expect(firstLink.nativeElement.parentElement.className).toBe('page-item');
    expect(previousLink.nativeElement.parentElement.className).toBe(
      'page-item'
    );
  });

  it('only disables Next and Last buttons when it is the last page', () => {
    // check links are disabled when it is the last page
    component.pageInfo = new PageInfo(2, 44, 3, 45);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const nextLink = debugElement.query(By.css('[testId="next-link"]'));
    const lastLink = debugElement.query(By.css('[testId="last-link"]'));

    expect(nextLink.nativeElement.parentElement.className).toBe(
      'page-item disabled'
    );
    expect(lastLink.nativeElement.parentElement.className).toBe(
      'page-item disabled'
    );

    // check links are NOT disabled when it is NOT the last page
    component.pageInfo = new PageInfo(1, 29, 3, 45);
    fixture.detectChanges();

    expect(nextLink.nativeElement.parentElement.className).toBe('page-item');
    expect(lastLink.nativeElement.parentElement.className).toBe('page-item');
  });

  it('searches the first page when the First link is clicked', () => {
    const searchSpy = spyOn<any>(component, 'search');
    component.pageInfo = new PageInfo(2, 44, 3, 45);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const firstLink = debugElement.query(By.css('[testId="first-link"]'));

    firstLink.nativeElement.dispatchEvent(new Event('click'));
    expect(searchSpy).toHaveBeenCalledWith(0);
  });

  it('searches the previous page when the Previous link is clicked', () => {
    const searchSpy = spyOn<any>(component, 'search');
    component.pageInfo = new PageInfo(2, 44, 3, 45);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const previousLink = debugElement.query(By.css('[testId="previous-link"]'));

    previousLink.nativeElement.dispatchEvent(new Event('click'));
    expect(searchSpy).toHaveBeenCalledWith(1);
  });

  it('searches the next page when the Next link is clicked', () => {
    const searchSpy = spyOn<any>(component, 'search');
    component.pageInfo = new PageInfo(1, 14, 3, 45);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const nextLink = debugElement.query(By.css('[testId="next-link"]'));

    nextLink.nativeElement.dispatchEvent(new Event('click'));
    expect(searchSpy).toHaveBeenCalledWith(2);
  });

  it('searches the last page when the Last link is clicked', () => {
    const searchSpy = spyOn<any>(component, 'search');
    component.pageInfo = new PageInfo(1, 14, 3, 45);
    fixture.detectChanges();
    const { debugElement } = fixture;
    const lastLink = debugElement.query(By.css('[testId="last-link"]'));

    lastLink.nativeElement.dispatchEvent(new Event('click'));
    expect(searchSpy).toHaveBeenCalledWith(2);
  });
});
