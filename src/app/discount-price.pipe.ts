import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPrice',
  standalone: true
})
export class DiscountPricePipe implements PipeTransform {


  transform(price: number, discountPercentage?: number): string {
    if (!discountPercentage || discountPercentage <= 0) {
      return `$${price.toFixed(2)}`;
    }

    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = price - discountAmount;
// <span style="text-decoration: line-through important; ">$${price.toFixed(2)}</span> 
//     /
    return `$${discountedPrice.toFixed(2)} `;

     
  }
}
