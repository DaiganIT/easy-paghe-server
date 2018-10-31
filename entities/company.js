import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from './employee';

@Entity()
export class Company {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('varchar')
	name = '';

	@OneToMany((type) => Employee, (e) => e.employer)
	employees = undefined;
}
