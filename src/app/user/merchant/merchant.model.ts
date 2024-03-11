import { User } from "../user.model";

export class Merchant {
    id!: number;
    address!: string;
    city!: string;
    merchant_id!: string;
    merchant_name!: string;
    phone!: string;
    postal_code!: string;
    profile_img!: string;
    parent!: User;
}
