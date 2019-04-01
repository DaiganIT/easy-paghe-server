import { Entity, Column, OneToMany } from 'typeorm';
import { CompanyBase } from './companyBase';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Company extends CustomerSpecific {
	@Column('varchar')
	name = '';

	@Column('varchar', { nullable: true, length: 16 })
	fiscalCode = '';

	@Column('varchar', { nullable: true, length: 11 })
	ivaCode = '';

	@Column('varchar', { nullable: true, length: 10 })
	inpsRegistrationNumber = '';

	@Column('varchar', { nullable: true, length: 10 })
	inailRegistrationNumber = '';

	@OneToMany(type => CompanyBase, e => e.company, { cascade: true })
	bases = undefined;
}
