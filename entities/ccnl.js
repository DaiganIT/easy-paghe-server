import { Entity, Column, OneToMany } from 'typeorm';
import { SalaryTable } from './salaryTable';
import { BaseEntity } from './baseEntity';

@Entity()
export class CCNL extends BaseEntity {
  @Column('varchar')
  name = '';

  @Column('datetime')
	originalDate = '';

  @Column('datetime')
	startDate = '';

	@Column('datetime')
  endDate = '';
  
  @Column('float')
  weekHours = 0;

  @Column('float')
  holidays = 0;
  
  @Column('float')
  extra = 0;
  
  @Column('float')
  night = 0;

  @Column('float')
  bankHolidays = 0;

  @Column('float')
  extraBankHolidays = 0;

  @Column('float')
  nightBankHolidays = 0;

  @Column('int')
  months = 0;

  @OneToMany(type => SalaryTable, e => e.ccnl, { cascade: true })
  salaryTable = undefined
}
