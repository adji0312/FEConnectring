export class Package {
  package_name!: string;
  package_header!: string;
  package_id!: string;
  merchant_id!: string;
  merchant_username!: string;
  value_date!: Date;
  start_date!: Date;
  end_date!: Date;
  price!: number;
  total_price!: number;
  isActive!: boolean;
  activateAll!: boolean;
  food_img!: Blob;
  packageItemDtoList!: PackageItem[];
}

export class PackageItem{
  food_name!: string;
}
