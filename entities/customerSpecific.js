import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer';

export class CustomerSpecific {
  @PrimaryGeneratedColumn()
	id = undefined;

  @ManyToOne(t => Customer)
  @JoinColumn()
  customer = undefined;
}