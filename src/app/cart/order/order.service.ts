import { Injectable } from '@angular/core';
import { Transaction } from 'src/app/transaction/transaction.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService{
  order!: Transaction;
}
