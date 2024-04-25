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
  merchant_name!: string;
  payment_img!: Blob;
  transactionDetailDtoList!: TransactionDetail[];
}

export class TransactionDetail{
  transaction_id!: string;
  package_id!: Package;
  notes!: string;
  flag_cancel!: boolean;
  flag_check!: boolean;
  food_names!: string;
  customer_username!: string;
  customer_name!: string;
  order_date!: Date;
}

export class TransactionReport{
  month!: Date;
  totalPrice!: number;
  transactionCount!: number;
}
