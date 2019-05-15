import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyBase } from './companyBase';
import { Person } from './person';
import { CustomerSpecific } from './customerSpecific';
import { SalaryTable } from './salaryTable';
import { CCNL } from './ccnl';

@Entity()
export class Hire extends CustomerSpecific {
  @Column('datetime')
	startDate = '';

	@Column('datetime')
	endDate = '';

	@Column('float')
  weekHours = 0;

  @Column('float')
  holidays = 0;

	@ManyToOne(type => CompanyBase, e => e.hirees)
	companyBase = undefined;

	@OneToOne(type => Person, e => e.hire)
	@JoinColumn()
	person = undefined;

	@OneToOne(type => CCNL)
	@JoinColumn()
	ccnl = undefined;

	@OneToOne(type => SalaryTable)
	@JoinColumn()
	salaryTable = undefined;
}
