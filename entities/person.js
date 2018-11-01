import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from './company';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column('varchar')
  name = '';

  @Column('varchar')
  phone = undefined;

  @Column('varchar')
  address = undefined;

  @Column('varchar', { unique: true })
  email = undefined;

  @ManyToOne((type) => Company, (c) => c.employees)
  company = undefined;
}
