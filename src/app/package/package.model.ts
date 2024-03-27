export class Package {

  package_header!: string;
  package_id!: string;
  merchant_id!: string;
  merchant_username!: string;
  value_date!: Date;
  start_date!: Date;
  end_date!: Date;
  price!: number;
  total_price!: number;
  food_img!: string;
  packageItemDtoList!: PackageItem[];
}

export class PackageItem{
  food_name!: string;
}
