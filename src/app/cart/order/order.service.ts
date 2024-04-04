import { Injectable } from '@angular/core';
import { Group } from 'src/app/group/group.model';
import { Transaction } from 'src/app/transaction/transaction.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService{
  order!: Transaction;

  group!: Group;
}
