import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company';
import { CustomerSpecific } from './customerSpecific';
import { Hire } from './hire';

@Entity()
export class CompanyBase extends CustomerSpecific {
	@Column('varchar')
	name = '';

	@Column('varchar', { nullable: true })
	address = '';

	@ManyToOne((type) => Company, (c) => c.bases, { nullable: true, onDelete: 'CASCADE' })
	company = undefined;

	@OneToMany(type => Hire, e => e.companyBase, { cascade: true })
	hirees = undefined;
}
