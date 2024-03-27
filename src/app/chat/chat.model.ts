import { Customer } from "../user/customer/customer.model";
import { Merchant } from "../user/merchant/merchant.model";

export class Chat {
    id!: number;
    customer!: Customer;
    merchant!: Merchant;
}
