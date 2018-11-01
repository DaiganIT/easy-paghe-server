import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class User extends CustomerSpecific {
  @Column('varchar', { unique: true })
  email = '';

  @Column('varchar')
  password = '';

  @Column('varchar')
  name = '';

  @Column('int')
  active = false;

  @Column('varchar')
  type = '';

  @Column('varchar', { nullable: true })
  activationCode = undefined;

  @Column('varchar', { nullable: true })
  activationCodeValidity = undefined;
}
