import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
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

	@ManyToOne(type => Person, e => e.hired)
	@JoinColumn()
	person = undefined;

	@ManyToOne(type => CCNL)
	@JoinColumn()
	ccnl = undefined;

	@ManyToOne(type => SalaryTable)
	@JoinColumn()
	salaryTable = undefined;
}
