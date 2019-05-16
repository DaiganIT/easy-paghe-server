import { Entity, Column, OneToMany } from 'typeorm';
import { Hire } from './hire';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Person extends CustomerSpecific {
	@Column('varchar')
	firstName = '';

	@Column('varchar')
	lastName = '';

	@Column('varchar', { nullable: true })
	phone = undefined;

	@Column('varchar', { nullable: true })
	address = undefined;

	@Column('varchar', { nullable: true })
	email = undefined;

	@OneToMany((type) => Hire, (c) => c.person, { nullable: true })
	hired = undefined;
}
