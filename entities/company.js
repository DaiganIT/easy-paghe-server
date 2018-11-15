import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './person';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Company extends CustomerSpecific {
	@Column('varchar')
	name = '';

	@Column('varchar', { nullable: true, length: 16 })
	fiscalCode = '';

	@Column('varchar', { nullable: true, length: 11 })
	ivaCode = '';

	@Column('varchar', { nullable: true })
	address = '';

	@Column('varchar', { nullable: true, length: 10 })
	inpsRegistrationNumber = '';

	@Column('varchar', { nullable: true, length: 10 })
	inailRegistrationNumber = '';

	@OneToMany(type => Person, e => e.employer)
	employees = undefined;
}
