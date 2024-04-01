import { SafeUrl } from "@angular/platform-browser";
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
    picByte!: Blob;
    description!: string;
    image_merchant!: File;
    username!: string;
    // file!: File;
    // url!: string;
}
