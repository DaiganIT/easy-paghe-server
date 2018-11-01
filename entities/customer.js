import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './baseEntity';
@Entity()
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('varchar')
	name = '';
}
