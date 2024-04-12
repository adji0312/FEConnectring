import { Package } from "../package/package.model";

export class Transaction{
  transaction_id!: string;
  totalPrice!: number;
  order_date!: Date;
  payment_status!: string;
  customer_username!: string;
  merchant_id!: string;
  package_header!: string;
  group_id!: string;
  payment_img!: Blob;
  transactionDetailDtoList!: TransactionDetail[];
}

export class TransactionDetail{
  package_id!: Package;
  notes!: string;
  flag_cancel!: boolean;
  flag_check!: boolean;
  food_names!: string;
  customer_username!: string;
  customer_name!: string;
  order_date!: Date;
}
