import { PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer';
import { BaseEntity } from './entity';

export class CustomerSpecific extends BaseEntity {
  @PrimaryGeneratedColumn()
	id = undefined;

  @ManyToOne(t => Customer)
  @JoinColumn()
  customer = undefined;
}