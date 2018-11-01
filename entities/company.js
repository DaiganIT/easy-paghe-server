import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './person';

@Entity()
export class Company {
	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('varchar')
	name = '';

	@Column('varchar')
	address = '';

	@Column('varchar')
	phone = '';

	@OneToOne(type => Person)
	@JoinColumn()
	mainContact = undefined;

	@OneToMany(type => Person, e => e.employer)
	employees = undefined;
}
