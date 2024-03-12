import { Customer } from "../user/customer/customer.model";

export class Group {
    id!: number;
    group_id!: string;
    group_name!: string;
    address!: string;
    city!: string;
    postal_code!: string;
    owner!: string;
    invite_code!: string;
    customers!: Customer[];
}
