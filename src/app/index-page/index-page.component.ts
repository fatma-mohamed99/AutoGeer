import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import categoriesData from './data/categories.json';
import { Router } from '@angular/router';

interface Category {
  title: string;
  image: string;
}

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css'],
})
export class IndexPageComponent {
  categories: Category[] = categoriesData as Category[];

  constructor(private router: Router) {}

  onCategoryClick(categoryTitle: string): void {
    this.router.navigate(['/category-products', categoryTitle]);
  }
}