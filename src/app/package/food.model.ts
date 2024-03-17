import { Merchant } from "../user/merchant/merchant.model";

export class Food {
    food_id!: string;
    food_name!: string;
    merchant: Merchant = new Merchant;
}
