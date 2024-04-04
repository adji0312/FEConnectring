import { Group } from "src/app/group/group.model";
import { User } from "../user.model";

export class Customer {

    id!: number;
    customer_id!: string;
    name!: string;
    phone!: string;
    profile_img!: string;
    // group: Group = new Group;
    parent_id!: number;
    invite_code!: string;
    username!: string;
    group_id!: number;
    group: Group = new Group;
    parent!: User;
}
