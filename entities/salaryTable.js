import { Entity, Column, ManyToOne } from 'typeorm';
import { CCNL } from './ccnl';
import { BaseEntity } from './baseEntity';

@Entity()
export class SalaryTable extends BaseEntity {
	@Column('int')
	isApprentice = false;

	@Column('varchar')
	level = '';

	@Column('decimal')
	baseSalary = 0;

	@Column('decimal')
	contingency = 0;

	@Column('decimal')
	thirdElement = 0;

	@Column('decimal')
	seniority = 0;

	@Column('int')
	hh = 0;

	@Column('int')
	gg = 0;

	@ManyToOne((type) => CCNL, (c) => c.salaryTable, { onDelete: 'CASCADE' })
	ccnl = undefined;
}
