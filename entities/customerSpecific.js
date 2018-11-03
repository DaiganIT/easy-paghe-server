import { ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer';
import { BaseEntity } from './baseEntity';

export class CustomerSpecific extends BaseEntity {
  @ManyToOne(t => Customer)
  @JoinColumn()
  customer = undefined;
}