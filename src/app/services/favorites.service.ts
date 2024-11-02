import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: Set<string> = new Set();
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  addFavorite(productId: string): void {
    if (!this.favorites.has(productId)) {
      this.favorites.add(productId);
      this.updateFavorites();
      console.log('Added to favorites:', productId);
    }
  }
  
  removeFavorite(productId: string): void {
    if (this.favorites.has(productId)) {
      this.favorites.delete(productId);
      this.updateFavorites();
      console.log('Removed from favorites:', productId);
    }
  }

  getFavorites(): string[] {
    return Array.from(this.favorites);
  }

  private updateFavorites(): void {
    const favoritesArray = Array.from(this.favorites);
    this.favoritesSubject.next(favoritesArray);
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  private loadFavorites(): void {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favorites = new Set(JSON.parse(savedFavorites));
      this.updateFavorites();
    }
  }

  isFavorite(productId: string): boolean {
    return this.favorites.has(productId);
  }
}