import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id = undefined;

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
