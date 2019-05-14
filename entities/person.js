import { Entity, Column, ManyToOne } from 'typeorm';
import { CompanyBase } from './companyBase';
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

	@ManyToOne((type) => CompanyBase, (c) => c.employees, { nullable: true })
	companyBase = undefined;
}
