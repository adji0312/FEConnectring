import { Pipe, PipeTransform } from '@angular/core';
import { Food, SearchModelFood } from './food.model';

@Pipe({
  name: 'searchFood'
})
export class SearchFoodPipe implements PipeTransform {

  transform(foods: Food[], foodSearch: SearchModelFood): any {
    // console.log(users);
    //tidak ada data

    if(!foods || foods.length === 0) return foods;

    // blank search
    if(!foodSearch || !foodSearch.food_name){
      // console.log(foodSearch);
      return foods;
    }

    // debugger;
    // console.log(foodSearch);

    return foods.filter((food) => {
      // console.log(user.user_name);
        return (!foodSearch.food_name || food.food_name.toLowerCase().includes(foodSearch.food_name) || food.food_name.includes(foodSearch.food_name));
    })
  }
}
