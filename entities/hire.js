import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyBase } from './companyBase';
import { Person } from './person';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class Hire extends CustomerSpecific {
  @Column('datetime')
	startDate = '';

	@Column('datetime')
	endDate = '';

	@ManyToOne(type => CompanyBase, e => e.hirees)
	companyBase = undefined;

	@OneToOne(type => Person, e => e.hire)
	@JoinColumn()
	person = undefined;
}
