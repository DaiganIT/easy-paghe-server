import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from './company';

@Entity()
export class Employee {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('text')
	name = '';

	@ManyToOne((type) => Company, (c) => c.employees)
	company = undefined;
}
