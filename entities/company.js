import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './person';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Company extends CustomerSpecific {
	@Column('varchar')
	name = '';

	@Column('varchar', { nullable: true })
	address = '';

	@Column('varchar', { nullable: true })
	phone = '';

	@OneToOne(type => Person, { nullable: true })
	@JoinColumn()
	mainContact = undefined;

	@OneToMany(type => Person, e => e.employer)
	employees = undefined;
}
