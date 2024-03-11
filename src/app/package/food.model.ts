import { Merchant } from "../user/merchant/merchant.model";

export class Food {
    id!: number;
    food_name!: string;
    merchant: Merchant = new Merchant;
}
