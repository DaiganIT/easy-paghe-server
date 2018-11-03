import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from './company';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Person extends CustomerSpecific {
	@Column('varchar')
	name = '';

	@Column('varchar', { nullable: true })
	phone = undefined;

	@Column('varchar', { nullable: true })
	address = undefined;

	@Column('varchar', { nullable: true })
	email = undefined;

	@ManyToOne((type) => Company, (c) => c.employees, { nullable: true })
	company = undefined;
}
